import { Modal, View, Text, TouchableOpacity } from "react-native";
import { Button } from "./Button";

type ConfirmModalProps = {
  visible: boolean;
  title: string;
  description?: string;
  onCancel: () => void;
  onConfirm: () => void;
  confirmText?: string;
};

export function ConfirmModal({
  visible,
  title,
  description,
  onCancel,
  onConfirm,
  confirmText = "Confirmar",
}: ConfirmModalProps) {
  return (
    <Modal
      transparent
      animationType="fade"
      visible={visible}
      statusBarTranslucent
    >
      {/* Backdrop */}
      <View className="flex-1 bg-black/30 items-center justify-center px-8">
        
        {/* Card */}
        <View className="bg-white w-full rounded-xl p-8">
          <Text className="text-center text-gray-2 text-lg font-bold mt-2 mb-8 px-4">
            {title}
          </Text>

          {description && (
            <Text className="text-center text-gray-3 mb-6">
              {description}
            </Text>
          )}

          <View className="flex-row gap-3">
            <Button
              title="Cancelar"
              variant="secondary"
              onPress={onCancel}
              className="flex-1"
            />

            <Button
              title={confirmText}
              onPress={onConfirm}
              className="flex-1"
            />
          </View>
        </View>
      </View>
    </Modal>
  );
}
