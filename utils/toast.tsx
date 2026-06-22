import toast from 'react-hot-toast';
import { CheckCircle2, XCircle, X } from 'lucide-react';

export const showToast = {
  success: (title: string, message?: string) => {
    toast.custom(
      (t) => (
        <div
          className={`${
            t.visible ? 'animate-enter' : 'animate-leave'
          } max-w-sm w-full bg-[#00C853] shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5`}
        >
          <div className="flex-1 w-0 p-4">
            <div className="flex items-start">
              <div className="flex-shrink-0 pt-0.5">
                <CheckCircle2 className="h-6 w-6 text-white" />
              </div>
              <div className="ml-3 flex-1">
                <p className="text-base font-bold text-white">{title}</p>
                {message && <p className="mt-1 text-sm text-white/90">{message}</p>}
              </div>
            </div>
          </div>
          <div className="flex border-l border-white/20">
            <button
              onClick={() => toast.dismiss(t.id)}
              className="w-full border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-white/80 hover:text-white hover:bg-white/10 focus:outline-none transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
      ),
      { duration: 4000, position: 'bottom-center' }
    );
  },
  
  error: (title: string, message?: string) => {
    toast.custom(
      (t) => (
        <div
          className={`${
            t.visible ? 'animate-enter' : 'animate-leave'
          } max-w-sm w-full bg-[#D32F2F] shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5`}
        >
          <div className="flex-1 w-0 p-4">
            <div className="flex items-start">
              <div className="flex-shrink-0 pt-0.5">
                <XCircle className="h-6 w-6 text-white" />
              </div>
              <div className="ml-3 flex-1">
                <p className="text-base font-bold text-white">{title}</p>
                {message && <p className="mt-1 text-sm text-white/90">{message}</p>}
              </div>
            </div>
          </div>
          <div className="flex border-l border-white/20">
            <button
              onClick={() => toast.dismiss(t.id)}
              className="w-full border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-white/80 hover:text-white hover:bg-white/10 focus:outline-none transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
      ),
      { duration: 4000, position: 'bottom-center' }
    );
  }
};
