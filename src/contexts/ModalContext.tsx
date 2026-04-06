import { createContext, ReactNode, useCallback, useContext, useState } from "react"
import { ConfirmModal } from "../components/ConfirmModal";

type ConfirmOptions = {
    title: string;
    description?: string;
    confirmText?: string;
    onConfirm: () => void;
    onCancel?: () => void;
}

type ModalContextData = {
    openConfirm: (options: ConfirmOptions) => void;
    close: () => void;
}

const ModalContext = createContext<ModalContextData | null>(null)

export function ModalProvider({
    children
} : {
        children: ReactNode
    }) {

    const [visible, setVisible] = useState(false)
    const [options, setOptions] = useState<ConfirmOptions | null>(null);

    const openConfirm = useCallback((opts: ConfirmOptions) => {
        setOptions(opts);
        setVisible(true);
    }, []);

    const close = useCallback(() => {
        setVisible(false);
        setOptions(null);
    }, []);

    function handleCancel() {
        options?.onCancel?.();
        close();
    }

    function handleConfirm() {
        options?.onConfirm();
        close();
    }

    return (
        <ModalContext.Provider value={{ openConfirm, close }}>
            {children}

            <ConfirmModal
                visible={visible}
                title={options?.title || ""}
                description={options?.description}
                confirmText={options?.confirmText}
                onCancel={handleCancel}
                onConfirm={handleConfirm}
            />
        </ModalContext.Provider>
    );
}

export function useModal() {
  const context = useContext(ModalContext);

  if (!context) {
    throw new Error("useModal must be used within ModalProvider");
  }

  return context;
}