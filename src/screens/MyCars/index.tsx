import React, { useState, useEffect } from 'react';
import { FlatList, StatusBar } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useTheme } from 'styled-components';
import { AntDesign } from '@expo/vector-icons';

import { BackButton } from '../../components/BackButton';

import { CarDTO } from '../../dtos/CarsDTO';
import api from '../../services/api';

import {
  Container,
  Header,
  Title,
  SubTitle,
  Content,
  Appointments,
  AppointmentsTitle,
  AppointmentsQuantity,
  CarWapper,
  CarFooter,
  CarFooterTitle,
  CarFooterPeriod,
  CarFooterDate,
} from './styles';
import { Car } from '../../components/Car';
import { LoadAnimation } from '../../components/LoadAnimation';

interface CarProps {
  id: string;
  user_id: string;
  car: CarDTO;
  startDate: string;
  endDate: string;
}

export function MyCars(){
  const [cars, setCars] = useState<CarProps[]>([]);
  const [loading, setLoading] = useState(true);

  const theme = useTheme();
  const navigation = useNavigation();

  function handleBack(){
    navigation.goBack();
  }

  useEffect(() => {
    async function fetchCars(){
      try {
        const response = await api.get('/schedules_byuser?user_id=1');
      setCars(response.data);
      } catch (error) {
        console.log(error);
      }finally {
        setLoading(false);
      }
    }

    fetchCars();
  }, []);


  return (
     <Container>
       <Header>
             <StatusBar 
             barStyle="light-content" 
             translucent
             backgroundColor="transparent"
             />
             <BackButton 
             onPress={handleBack}
             color={theme.colors.shape}
             />

             <Title>
             Escolha uma {'\n'}
            data de início e {'\n'}
             fim do aluguel 
             </Title>

             <SubTitle>Conforto, segurança, e praticidade.</SubTitle>

         </Header>
         { loading ? <LoadAnimation /> :
         <Content>
          <Appointments>
            <AppointmentsTitle>Agendamentos feitos</AppointmentsTitle>
            <AppointmentsQuantity>{cars.length}</AppointmentsQuantity>
          </Appointments>

          <FlatList
            data={cars}
            keyExtractor={item => String(item.id)}
            showsVerticalScrollIndicator={false}

            renderItem={({ item }) => (
              <CarWapper>
                 <Car data={item.car} />
                 <CarFooter>
                   <CarFooterTitle>Período</CarFooterTitle>
                   <CarFooterPeriod>
                     <CarFooterDate>{item.startDate}</CarFooterDate>
                     <AntDesign 
                      name="arrowright"
                      size={20}
                      color={theme.colors.title}
                      style={{marginHorizontal: 10}}
                     />
                    <CarFooterDate>{item.endDate}</CarFooterDate>
                   </CarFooterPeriod>
                 </CarFooter>
              </CarWapper>
              )} 
            />
          </Content> 
         }
     </Container>
  );
}