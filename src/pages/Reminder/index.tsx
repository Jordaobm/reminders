/* eslint-disable react-native/no-inline-styles */
import { yupResolver } from "@hookform/resolvers/yup";
import { useNavigation } from "@react-navigation/native";
import { addDays, format, isAfter, subDays } from "date-fns";
import { ArrowLeft, TrashSimple } from "phosphor-react-native";
import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { TouchableOpacity, View } from "react-native";
import { TextInputMask } from "react-native-masked-text";
import styled from "styled-components/native";
import * as yup from "yup";
import { IReminder } from "../../@types/Reminder";
import {
  CreateReminderDatabase,
  DeleteReminderDatabase,
  UpdateReminderDatabase,
} from "../../services/database";
import { COLORS, FONTS } from "../../styles/global";
import { DAYS_OF_WEEK, REGEX_FORMAT_DATE, TYPES } from "../../utils/constantes";
import {
  dateToString,
  dateWithoutTimezone,
  parsedDate,
} from "../../utils/date";

interface ReminderProps {
  route?: {
    params?: IReminder;
  };
}

export const Reminder = ({ route }: ReminderProps) => {
  const navigation = useNavigation();

  const [type, setType] = useState("unique");
  const [dayOfWeek, setDayOfWeek] = useState("");

  const schema = yup
    .object()
    .shape({
      title: yup.string().required("*Campo obrigatório"),
      date: yup
        .string()
        .required("*Campo obrigatório")
        .test({
          message: "Data inválida ou passada, tente dd/MM/yyyy HH:MM",
          test: (value = "") => {
            if (new RegExp(REGEX_FORMAT_DATE).exec(value)) {
              const isValidDate = parsedDate(value);

              if (!isNaN(isValidDate.getTime())) {
                return isAfter(isValidDate, dateWithoutTimezone(new Date()));
              }

              return false;
            }

            return false;
          },
        }),
      interval: yup.string().test({
        message: "*Campo obrigatório",
        test: (value) => {
          if (type === TYPES.days.value) {
            return !!value;
          }
          return true;
        },
      }),
      description: yup.string().nullable(),
    })
    .required();

  const {
    handleSubmit,
    getValues,
    control,
    setValue,
    formState: { errors },
  } = useForm<IReminder>({
    resolver: yupResolver(schema),
    defaultValues: route?.params?.id
      ? {
          ...route?.params,
          date: dateToString(route?.params?.date),
        }
      : ({} as IReminder),
  });

  const goBack = () => {
    navigation.navigate("Home");
  };

  const onSubmit = async () => {
    const newReminder = {
      ...getValues(),
      type,
      date: parsedDate(getValues()?.date).toISOString(),
    } as IReminder;

    if (newReminder?.id) {
      await UpdateReminderDatabase(newReminder);
    } else {
      await CreateReminderDatabase(newReminder);
    }

    navigation.navigate("Home");
  };

  const onDelete = async () => {
    DeleteReminderDatabase(getValues("id")).then(() => {
      goBack();
    });
  };

  const onSelectType = (selectedType: string) => {
    setType(selectedType);
    setDayOfWeek("");
  };

  const onSelectDayOfWeek = (selectedDay: string) => {
    setDayOfWeek(selectedDay);

    let date = subDays(new Date(), 1);

    do {
      date = addDays(date, 1);
      setValue("date", format(date, "dd/MM/yyyy 00:00"));
    } while (selectedDay !== format(date, "EEEE"));
  };

  return (
    <Container>
      <Scroll>
        <Header>
          <TouchableOpacity onPress={goBack}>
            <ArrowLeft size={24} color={COLORS.blue[900]} />
          </TouchableOpacity>

          <HeaderText>
            {getValues("id") ? "Editar lembrete" : "Novo lembrete"}
          </HeaderText>

          {getValues("id") ? (
            <Remove onPress={onDelete}>
              <TrashSimple size={24} color={COLORS.red[500]} />
            </Remove>
          ) : (
            <View />
          )}
        </Header>

        <InputContainer>
          <Label>Título</Label>
          <Controller
            name="title"
            control={control}
            render={({ field }) => (
              <>
                <Input
                  placeholder="Insira o título do lembrete"
                  value={field?.value}
                  onChangeText={(text: string) => field?.onChange(text)}
                />
                {errors?.title && (
                  <FieldError>{errors?.title?.message}</FieldError>
                )}
              </>
            )}
          />
        </InputContainer>

        <InputContainer>
          <Label>Tipo de lembrete</Label>

          <GroupButtons>
            <Option
              selected={type === TYPES.unique.value}
              onPress={() => onSelectType(TYPES.unique.value)}
            >
              <OptionText>{TYPES.unique.label}</OptionText>
            </Option>
            <Option
              selected={type === TYPES.weekly.value}
              onPress={() => onSelectType(TYPES.weekly.value)}
            >
              <OptionText>{TYPES.weekly.label}</OptionText>
            </Option>
            <Option
              selected={type === TYPES.days.value}
              onPress={() => onSelectType(TYPES.days.value)}
            >
              <OptionText>{TYPES.days.label}</OptionText>
            </Option>
            <Option
              selected={type === TYPES.month.value}
              onPress={() => onSelectType(TYPES.month.value)}
            >
              <OptionText>{TYPES.month.label}</OptionText>
            </Option>
          </GroupButtons>
        </InputContainer>

        {type === TYPES.weekly.value && (
          <InputContainer>
            <Label>Selecione o dia da semana</Label>

            <GroupButtons>
              <Option
                selected={dayOfWeek === DAYS_OF_WEEK.sunday.value}
                onPress={() => onSelectDayOfWeek(DAYS_OF_WEEK.sunday.value)}
              >
                <OptionText>{DAYS_OF_WEEK.sunday.label}</OptionText>
              </Option>
              <Option
                selected={dayOfWeek === DAYS_OF_WEEK.monday.value}
                onPress={() => onSelectDayOfWeek(DAYS_OF_WEEK.monday.value)}
              >
                <OptionText>{DAYS_OF_WEEK.monday.label}</OptionText>
              </Option>
              <Option
                selected={dayOfWeek === DAYS_OF_WEEK.tuesday.value}
                onPress={() => onSelectDayOfWeek(DAYS_OF_WEEK.tuesday.value)}
              >
                <OptionText>{DAYS_OF_WEEK.tuesday.label}</OptionText>
              </Option>
              <Option
                selected={dayOfWeek === DAYS_OF_WEEK.wednesday.value}
                onPress={() => onSelectDayOfWeek(DAYS_OF_WEEK.wednesday.value)}
              >
                <OptionText>{DAYS_OF_WEEK.wednesday.label}</OptionText>
              </Option>
              <Option
                selected={dayOfWeek === DAYS_OF_WEEK.thursday.value}
                onPress={() => onSelectDayOfWeek(DAYS_OF_WEEK.thursday.value)}
              >
                <OptionText>{DAYS_OF_WEEK.thursday.label}</OptionText>
              </Option>
              <Option
                selected={dayOfWeek === DAYS_OF_WEEK.friday.value}
                onPress={() => onSelectDayOfWeek(DAYS_OF_WEEK.friday.value)}
              >
                <OptionText>{DAYS_OF_WEEK.friday.label}</OptionText>
              </Option>
              <Option
                selected={dayOfWeek === DAYS_OF_WEEK.saturday.value}
                onPress={() => onSelectDayOfWeek(DAYS_OF_WEEK.saturday.value)}
              >
                <OptionText>{DAYS_OF_WEEK.saturday.label}</OptionText>
              </Option>
            </GroupButtons>
          </InputContainer>
        )}

        <InputContainer>
          <Label>Data e hora</Label>

          <Controller
            name="date"
            control={control}
            render={({ field }) => (
              <>
                <InputMask
                  type={"custom"}
                  options={{
                    mask: "99/99/9999 99:99",
                  }}
                  value={field?.value}
                  onChangeText={(text) => {
                    field?.onChange(text);
                  }}
                  placeholder="Insira a data do lembrete"
                />
                {errors?.date && (
                  <FieldError>{errors?.date?.message}</FieldError>
                )}
              </>
            )}
          />
        </InputContainer>

        {type === TYPES.days.value && (
          <InputContainer>
            <Label>Intervalo de dias</Label>
            <Controller
              name="interval"
              control={control}
              render={({ field }) => (
                <>
                  <Input
                    placeholder="Insira o intervalo do lembrete"
                    value={field?.value}
                    onChangeText={(text: string) => field?.onChange(text)}
                  />
                  {errors?.interval && (
                    <FieldError>{errors?.interval?.message}</FieldError>
                  )}
                </>
              )}
            />
          </InputContainer>
        )}

        <NoteContainer>
          <Label>Descrição (Opcional)</Label>
          <Controller
            name="description"
            control={control}
            render={({ field }) => (
              <Note
                style={{
                  textAlignVertical: "top",
                }}
                placeholder="Adicione uma descrição"
                value={field?.value}
                onChangeText={(text: string) => field?.onChange(text)}
              />
            )}
          />
        </NoteContainer>
      </Scroll>

      <Button onPress={handleSubmit(onSubmit)}>
        <ButtonText>
          {getValues("id") ? "Salvar" : "Adicionar lembrete"}
        </ButtonText>
      </Button>
    </Container>
  );
};

const Scroll = styled.ScrollView`
  background-color: ${COLORS.white};
  height: 100%;
`;

const Container = styled.View`
  width: 100%;
  padding: 4%;
  color: ${COLORS.blue[900]};
  background-color: ${COLORS.white};
`;

const Header = styled.View`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-top: 16px;
`;

const HeaderText = styled.Text`
  font-size: 18px;
  color: ${COLORS.blue[900]};
  font-weight: bold;
  font-family: ${FONTS.medium};
`;

const InputContainer = styled.View`
  font-size: 18px;
  color: ${COLORS.blue[900]};
  margin-top: 26px;
`;

const NoteContainer = styled.View`
  font-size: 18px;
  color: ${COLORS.blue[900]};
  margin-top: 26px;
  margin-bottom: 120px;
  font-family: ${FONTS.medium};
`;

const Label = styled.Text`
  font-size: 18px;
  color: ${COLORS.blue[900]};
  font-weight: bold;
  font-family: ${FONTS.medium};
`;

const Input = styled.TextInput`
  font-size: 16px;
  color: ${COLORS.blue[900]};
  border: 1px solid ${COLORS.blue[800]};
  border-radius: 8px;
  margin-top: 12px;
  background-color: ${COLORS.white};
  padding: 12px;
  font-family: ${FONTS.medium};
`;

const InputMask = styled(TextInputMask)`
  font-size: 16px;
  color: ${COLORS.blue[900]};
  border: 1px solid ${COLORS.blue[800]};
  border-radius: 8px;
  margin-top: 12px;
  background-color: ${COLORS.white};
  padding: 12px;
  font-family: ${FONTS.medium};
`;

const Note = styled.TextInput`
  font-size: 16px;
  color: ${COLORS.blue[900]};
  border: 1px solid ${COLORS.blue[800]};
  border-radius: 8px;
  margin-top: 12px;
  background-color: ${COLORS.white};
  padding: 12px;
  min-height: 120px;
  font-family: ${FONTS.medium};
`;

const Button = styled.TouchableHighlight`
  background-color: ${COLORS.blue[800]};
  height: 60px;
  position: absolute;
  width: 100%;
  margin-left: 4%;
  bottom: 4%;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
`;
const ButtonText = styled.Text`
  font-size: 18px;
  color: ${COLORS.white};
  font-weight: bold;
`;

const FieldError = styled.Text`
  font-size: 12px;
  color: ${COLORS.red[500]};

  margin-top: 8px;
`;

const GroupButtons = styled.View`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  width: 100%;
`;

interface IButtonType {
  selected?: boolean;
}

const Option = styled.TouchableHighlight<IButtonType>`
  background-color: ${COLORS.button};
  opacity: ${(props) => (props?.selected ? 1 : 0.3)};
  margin-right: 4%;
  margin-top: 12px;
  padding: 12px;
  border-radius: 8px;
`;
const OptionText = styled.Text`
  font-family: ${FONTS.bold};
  color: ${COLORS.blue[900]};
  font-size: 12px;
`;
const Remove = styled.TouchableOpacity``;
