import { Dialog } from "@headlessui/react";

export default function LoginModal({ isOpen, setIsOpen, title, children }) {
  return (
    <Dialog open={isOpen} onClose={setIsOpen} className="relative z-50">
      <div className="fixed inset-0 bg-black/40" />

      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="w-full max-w-sm rounded-2xl bg-white p-6">
          
          {/* Dynamic Title */}
          <Dialog.Title className="text-lg font-semibold mb-4">
            {title}
          </Dialog.Title>

          {children}
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}
