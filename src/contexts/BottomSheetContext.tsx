import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
} from "react";

import {
  BottomSheetModal,
  BottomSheetBackdrop,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import { ScrollView } from "react-native";

type BottomSheetContextData = {
  open: (render: () => ReactNode, snapPoints?: string[]) => void;
  close: () => void;
};

const BottomSheetContext = createContext<BottomSheetContextData | null>(null);

export function BottomSheetProvider({
  children,
}: {
  children: ReactNode;
}) {
  // console.log("BottomSheetContext loaded");
  
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);

  const [renderContent, setRenderContent] = useState<(() => ReactNode) | null>(null);
  const [snapPoints, setSnapPoints] = useState<string[]>(["50%"]);

  const memoizedSnapPoints = useMemo(() => snapPoints, [snapPoints]);

  const open = useCallback(
    (render: () => ReactNode, customSnapPoints?: string[]) => {
      setRenderContent(() => render);

      if (customSnapPoints) {
        setSnapPoints(customSnapPoints);
      }

      requestAnimationFrame(() => {
        bottomSheetModalRef.current?.present();
      });
    },
    []
  );

  const close = useCallback(() => {
    bottomSheetModalRef.current?.dismiss();
    setRenderContent(null);

  }, []);

  const renderBackdrop = useCallback(
    (props: any) => (
      <BottomSheetBackdrop
        {...props}
        appearsOnIndex={0}
        disappearsOnIndex={-1}
        opacity={0.5}
        pressBehavior="close"
      />
    ),
    []
  );

  return (
    <BottomSheetContext.Provider value={{ open, close }}>
      {children}

      <BottomSheetModal
        ref={bottomSheetModalRef}
        snapPoints={memoizedSnapPoints}
        backdropComponent={renderBackdrop}
        enablePanDownToClose
        
      >
        <BottomSheetView style={{ flex: 1, marginBottom: 20 }}>
          {renderContent?.()}
        </BottomSheetView>
      </BottomSheetModal>
    </BottomSheetContext.Provider>
  );
}

export function useBottomSheet() {
  const context = useContext(BottomSheetContext)

  // console.log("Context value:", context)

  if (!context) {
    throw new Error("useBottomSheet must be used within BottomSheetProvider")
  }

  return context
}