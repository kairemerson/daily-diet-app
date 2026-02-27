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
  open: (content: ReactNode, snapPoints?: string[]) => void;
  close: () => void;
};

const BottomSheetContext = createContext({} as BottomSheetContextData);

export function BottomSheetProvider({
  children,
}: {
  children: ReactNode;
}) {
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);

  const [content, setContent] = useState<ReactNode>(null);
  const [snapPoints, setSnapPoints] = useState<string[]>(["50%"]);

  const memoizedSnapPoints = useMemo(() => snapPoints, [snapPoints]);

  const open = useCallback(
    (component: ReactNode, customSnapPoints?: string[]) => {
      setContent(component);

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
          {content}
        </BottomSheetView>
      </BottomSheetModal>
    </BottomSheetContext.Provider>
  );
}

export function useBottomSheet() {
  return useContext(BottomSheetContext);
}