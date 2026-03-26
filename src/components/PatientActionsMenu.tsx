import { Text, View, TouchableOpacity } from "react-native"
import { MaterialIcons } from "@expo/vector-icons"
import { colors } from "../theme/colors"
import { PatientStatus } from "../types/patients"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { updatePatientStatus } from "../services/patients"

type Props = {
    patientId: string
    status: PatientStatus
    closeBottomSheet: () => void

}

export function PatientActionsMenu({ status, patientId, closeBottomSheet }: Props) {

    const isActive = status === "ACTIVE"

    function getNextStatus(status: PatientStatus): PatientStatus {
        console.log("getnextStatus: ", status);
        
        if (status === "ACTIVE") return "INACTIVE"
        return "ACTIVE"
    }

    const queryClient = useQueryClient()

    const {mutateAsync, isPending} = useMutation({
        mutationFn: (newStatus: PatientStatus) => updatePatientStatus(patientId, newStatus),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["dashboard", patientId]
            })
        }
    })

    async function handleChangeStatus() {
        const newStatus = getNextStatus(status)
        
        await mutateAsync(newStatus)
    }

  return (
    <View className="px-6 pt-5 pb-20">

      <Text className="text-center text-gray-1 font-nunito_bold text-base mb-6">
        Ações do paciente
      </Text>

      {/* EDITAR */}
      <TouchableOpacity
        activeOpacity={0.7}
        className="flex-row items-center justify-between py-4"
      >
        <View className="flex-row items-center gap-3">
          <View className="w-10 h-10 rounded-xl bg-gray-6 items-center justify-center">
            <MaterialIcons name="edit" size={20} color={colors.gray[2]} />
          </View>

          <Text className="text-gray-1 font-nunito_bold">
            Editar paciente
          </Text>
        </View>

        <MaterialIcons name="chevron-right" size={20} color={colors.gray[4]} />
      </TouchableOpacity>

      <View className="h-[1px] bg-gray-5" />

      {/* ATIVAR / INATIVAR */}
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={handleChangeStatus}
        className="flex-row items-center justify-between py-4"
      >
        <View className="flex-row items-center gap-3">

          <View
            className={`w-10 h-10 rounded-xl items-center justify-center ${
              isActive ? "bg-red-light" : "bg-green-light"
            }`}
          >
            <MaterialIcons
              name={isActive ? "person-off" : "person"}
              size={20}
              color={isActive ? "#DC2626" : "#16A34A"}
            />
          </View>

          <Text
            className={`font-nunito_bold ${
              isActive ? "text-red-dark" : "text-green-dark"
            }`}
          >
            {isActive ? "Inativar paciente" : "Ativar paciente"}
          </Text>

        </View>

        <MaterialIcons name="chevron-right" size={20} color={colors.gray[4]} />
      </TouchableOpacity>

      <View className="h-[1px] bg-gray-5" />

      {/* PAUSED */}
      <TouchableOpacity
        activeOpacity={0.7}
        className="flex-row items-center justify-between py-4"
      >
        <View className="flex-row items-center gap-3">

          <View className="w-10 h-10 rounded-xl bg-gray-6 items-center justify-center">
            <MaterialIcons name="person" size={20} color={colors.gray[4]} />
          </View>

          <Text className="text-gray-3 font-nunito_bold">
            Pausar paciente
          </Text>

        </View>

        <MaterialIcons name="chevron-right" size={20} color={colors.gray[4]} />
      </TouchableOpacity>
      <View className="h-[1px] bg-gray-5" />

      {/* EXCLUIR */}
      <TouchableOpacity
        activeOpacity={0.7}
        className="flex-row items-center justify-between py-4"
      >
        <View className="flex-row items-center gap-3">

          <View className="w-10 h-10 rounded-xl bg-red-light items-center justify-center">
            <MaterialIcons name="delete" size={20} color="#DC2626" />
          </View>

          <Text className="text-red-dark font-nunito_bold">
            Excluir paciente
          </Text>

        </View>

        <MaterialIcons name="chevron-right" size={20} color={colors.gray[4]} />
      </TouchableOpacity>

    </View>
  )
}