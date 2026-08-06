import { View, Text, TouchableOpacity, FlatList, Image, Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useQuery } from "@tanstack/react-query";

import { SafeAreaView } from "react-native-safe-area-context";
import { AdminNavigationProps } from "../routes/admin.routes";
import { getPatientsRequest } from "../services/patients";
import { MaterialIcons } from "@expo/vector-icons";
import { colors } from "../theme/colors";
import { Skeleton } from "../components/Skeleton";
import { AnimatedPatientCard } from "../components/AnimatedPatientCard";
import { useAuth } from "../contexts/AuthContext";
import { ConfirmModal } from "../components/ConfirmModal";
import { useEffect, useState } from "react";
import { getUserProfileRequest } from "../services/user";


export function HomeAdmin() {

  const navigation = useNavigation<AdminNavigationProps>()
  const {user} = useAuth()

  const [openModal, setOpenModal] = useState(false)
  const [modalTitle, setModalTitle] = useState("")
  const [modalDescription, setModalDescription] = useState("")

  const {data: patients=[], isLoading} = useQuery({
    queryKey: ["patients"],
    queryFn: getPatientsRequest,
    enabled: !!user
  })

  const { data: userProfile } = useQuery({
    queryKey: ["userProfile", user?.id],
    queryFn: getUserProfileRequest,
    enabled: !!user,
    staleTime: 1000 * 60 * 60 * 24, //Considera o dado fresco por 24 horas
    refetchOnWindowFocus: true
  });

  // console.log("HomeAdmin = patients: ", patients);

  // FUNÇÃO AUXILIAR: Valida o tempo real localmente no celular (Segurança offline/tempo real)
  function checkIfSubscriptionExpired() {
    if (!userProfile) return false;
    
    // Se o backend já marcou como expirado, bloqueia direto
    if (userProfile.isSubscriptionExpired) return true;

    // Se o backend não atualizou a flag mas enviou a data limite (nextBillingDate)
    if (userProfile.nextBillingDate) {
      const now = new Date();
      const expirationDate = new Date(userProfile.nextBillingDate);
      
      // Se o relógio do celular já passou da data de faturamento, bloqueia localmente!
      return now > expirationDate;
    }

    return false;
  }
  
  useEffect(() => {
    console.log("HomeAdmin: userProfile =>",userProfile);
    const isExpired = checkIfSubscriptionExpired();

    if (isExpired) {
      setModalTitle("Renovação Necessária");
      setModalDescription("Identificamos que o período de faturamento do seu plano expirou. Ative o plano novamente para continuar gerenciando seus pacientes.");
      setOpenModal(true);
    }
  }, [userProfile]);

  function handleAddPatient() {
    if (!userProfile) return;

    const isPlanExpired = checkIfSubscriptionExpired();

    if (isPlanExpired) {
      setModalTitle("Plano Bloqueado");
      setModalDescription("Efetue o pagamento da sua assinatura para liberar a criação de novos pacientes.");
      setOpenModal(true);
      return;
    }

    // TRAVA 2: Validação de lotação ajustada com a regra Math.max anterior
    const currentTotalPatients = Math.max(userProfile.currentPatientsCount, patients.length);

    if (currentTotalPatients >= userProfile.maxPatients) {
      setModalTitle("Limite do Plano Atingido");
      setModalDescription(`Seu plano atual (${userProfile.plan}) permite até ${userProfile.maxPatients} pacientes cadastrados.\n\nFaça um upgrade para continuar adicionando novos pacientes.`);
      setOpenModal(true);
      return;
    }

    // Se tiver vagas livres no plano, avança para o formulário normalmente
    navigation.navigate("PatientCreateForm");
  }
  
    
  return (
    <SafeAreaView className="flex-1 bg-white px-6">
      
      {/* Header */}
      <View className="flex-row justify-between items-center mb-4 mt-4">
       
        <Image source={require("../assets/logo-horizontal.png")} style={{ width: 100, height: undefined, aspectRatio: 134 / 42 }} resizeMode="contain" />

        <TouchableOpacity onPress={() => navigation.navigate("NutritionistProfile")} >
          <View className="w-10 h-10 rounded-full bg-gray-300" />

        </TouchableOpacity>
      </View>

      

      <Text className="text-2xl font-nunito_bold text-gray-1 mt-4 mb-6">
        Pacientes
      </Text>

      <FlatList
        data={patients}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        renderItem={({item, index}) => (
          <AnimatedPatientCard
            index={index}
            name={item.name}
            adherence={item.adherence}
            lastActivity={item.lastActivity}
            onPress={() => navigation.navigate("PatientDetails", {patientId: item.id})}
          />
        )}
        ListEmptyComponent={() => {
          if(isLoading) {
            return (
              <> 
                <Skeleton width={"100%"} height={60}/>
                <Skeleton width={"100%"} height={60} className="mt-4"/>
                <Skeleton width={"100%"} height={60} className="mt-4"/>
                <Skeleton width={"100%"} height={60} className="mt-4"/>
              </>

            )
          } else {
            return (
              <>
                <Text className="font-nunito_regular text-gray-3 text-center mt-20">Nenhum paciente adicionado.</Text>
                <Text className="font-nunito_regular text-gray-3 text-center mt-1">Adicione um paciente!</Text>
              </>
            )
          }
        }
          
        }
      />

      <TouchableOpacity onPress={handleAddPatient} activeOpacity={0.7} className="items-center justify-center bg-green-dark rounded-full w-16 h-16 ml-auto mb-6">
        <MaterialIcons name="add" size={24} color={colors.white}/>

      </TouchableOpacity>

      {openModal && (
        <ConfirmModal 
          visible={openModal}
          onCancel={()=> setOpenModal(false)}
          onConfirm={() => {setOpenModal(false); navigation.navigate("SubscriptionScreen")}}
          title={modalTitle}
          description={modalDescription}
          confirmText="Ver Planos"
        />

      )}
    
    </SafeAreaView>
  );
}
