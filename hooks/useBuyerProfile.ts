import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import { walletService, WalletResponse } from '@/services/walletService';
import { addressService, AddressResponse } from '@/services/addressService';
import { useAuthStore } from '@/hooks/useAuthStore';
import { showToast } from '@/utils/toast';
import { authService } from '@/services/authService';

type ProfileTab = 'personal' | 'address' | 'wallet';

export const useBuyerProfile = () => {
  const { user, activeRole } = useAuthStore();
  const searchParams = useSearchParams();
  const urlTab = searchParams.get('tab') as ProfileTab;
  const { updateUser } = useAuthStore();
  
  const [activeTab, setActiveTab] = useState<ProfileTab>(
    (urlTab === 'wallet' || urlTab === 'address' || urlTab === 'personal') ? urlTab : 'personal'
  );

  useEffect(() => {
    if (urlTab === 'wallet' || urlTab === 'address' || urlTab === 'personal') {
      setActiveTab(urlTab);
    }
  }, [urlTab]);

  // Wallet state
  const [wallet, setWallet] = useState<WalletResponse | null>(null);
  const [isLoadingWallet, setIsLoadingWallet] = useState(false);
  const [isTopingUp, setIsTopingUp] = useState(false);

  // Address state
  const [addresses, setAddresses] = useState<AddressResponse[]>([]);
  const [isLoadingAddresses, setIsLoadingAddresses] = useState(false);
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [isDeletingId, setIsDeletingId] = useState<number | null>(null);

  // Profile Edit state
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const [editProfileForm, setEditProfileForm] = useState({ full_name: '', avatar_url: '' });

  useEffect(() => {
    if (user) {
      setEditProfileForm({ full_name: user.name, avatar_url: user.avatar_url || '' });
    }
  }, [user]);

  const loadWallet = useCallback(async () => {
    if (activeRole?.toUpperCase() !== 'BUYER') return;
    setIsLoadingWallet(true);
    try {
      const data = await walletService.getWallet();
      setWallet(data);
    } catch (error) {
      console.error("Failed to load wallet", error);
    } finally {
      setIsLoadingWallet(false);
    }
  }, [activeRole]);

  const loadAddresses = useCallback(async () => {
    if (activeRole?.toUpperCase() !== 'BUYER') return;
    setIsLoadingAddresses(true);
    try {
      const data = await addressService.getAddresses();
      setAddresses(data);
    } catch (error) {
      console.error("Failed to load addresses", error);
    } finally {
      setIsLoadingAddresses(false);
    }
  }, [activeRole]);

  useEffect(() => {
    if (activeTab === 'wallet') loadWallet();
    if (activeTab === 'address') loadAddresses();
  }, [activeTab, loadWallet, loadAddresses]);

  const handleTopUp = async (amount: number) => {
    if (amount <= 0) {
      showToast.error("Gagal", "Jumlah top-up harus lebih dari 0.");
      return;
    }
    if (amount > 10000000) {
      showToast.error("Gagal", "Maksimum top-up Rp 10.000.000.");
      return;
    }
    setIsTopingUp(true);
    try {
      const data = await walletService.topUp({ amount });
      setWallet(data);
      showToast.success("Berhasil", `Top-up Rp ${amount.toLocaleString('id-ID')} berhasil!`);
    } catch (error: any) {
      const msg = error.response?.data?.detail || "Gagal melakukan top-up.";
      showToast.error("Gagal", msg);
    } finally {
      setIsTopingUp(false);
    }
  };

  const handleAddAddress = async (fullAddress: string) => {
    if (!fullAddress.trim()) {
      showToast.error("Gagal", "Alamat tidak boleh kosong.");
      return;
    }

    setIsAddingAddress(true);
    try {
      await addressService.addAddress({ full_address: fullAddress });
      showToast.success("Berhasil", "Alamat baru berhasil ditambahkan!");
      await loadAddresses();
    } catch (error: any) {
      const msg = error.response?.data?.detail || "Gagal menambahkan alamat.";
      showToast.error("Gagal", msg);
    } finally {
      setIsAddingAddress(false);
    }
  };

  const handleDeleteAddress = async (addressId: number) => {
    setIsDeletingId(addressId);
    try {
      await import('@/services/api').then(mod => mod.default.delete(`/buyer/addresses/${addressId}`));
      showToast.success("Berhasil", "Alamat berhasil dihapus.");
      setAddresses(prev => prev.filter(a => a.id !== addressId));
    } catch (error: any) {
      const msg = error.response?.data?.detail || "Gagal menghapus alamat.";
      showToast.error("Gagal", msg);
    } finally {
      setIsDeletingId(null);
    }
  };

  const handleUpdateProfile = async () => {
    if (!editProfileForm.full_name.trim()) {
      showToast.error('Gagal', 'Nama tidak boleh kosong.');
      return;
    }
    
    setIsUpdatingProfile(true);
    try {
      const data = await authService.updateProfile({
        full_name: editProfileForm.full_name,
        avatar_url: editProfileForm.avatar_url
      });
      
      updateUser({
        name: data.full_name,
        avatar_url: data.avatar_url
      });
      
      showToast.success('Berhasil', 'Profil berhasil diperbarui.');
      setIsEditProfileOpen(false);
    } catch (error: any) {
      const msg = error.response?.data?.detail || 'Gagal memperbarui profil.';
      showToast.error('Gagal', msg);
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  return {
    activeTab,
    setActiveTab,
    user,
    wallet,
    isLoadingWallet,
    isTopingUp,
    handleTopUp,
    addresses,
    isLoadingAddresses,
    isAddingAddress,
    handleAddAddress,
    isDeletingId,
    handleDeleteAddress,
    isEditProfileOpen,
    setIsEditProfileOpen,
    isUpdatingProfile,
    editProfileForm,
    setEditProfileForm,
    handleUpdateProfile
  };
};
