import { Dialog } from "@headlessui/react";

export default function LoginModal({ isOpen, setIsOpen, title, children }) {
  return (
    <Dialog open={isOpen} onClose={setIsOpen} className="relative z-50">
      <div className="fixed inset-0 bg-black/40" />

      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="w-full max-w-sm rounded-2xl bg-white p-6">
          
         {/* Header (Title + Close Button) */}
         <div className="flex items-center justify-between mb-4">
            <Dialog.Title className="text-lg font-semibold">
              {title}
            </Dialog.Title>

            <button
                onClick={() => setIsOpen(false)}
                // className="flex items-center gap-2 px-2 py-1 
                // hover:bg-gray-100 rounded-full cursor-pointer transition"
                className="close-button px-8 py-4 text-2xl font-bold"
            >
                <span className="text-xl leading-none">×</span>
                <span className="text-sm">Close</span>
            </button>
         </div>

          {children}
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}
