import React, { useState, useEffect } from 'react'; // Импортируйте useEffect
import { View, Image, StyleSheet, TouchableOpacity, Text } from 'react-native';
import axios, { AxiosError } from 'axios';
import { Slider } from 'react-native-elements'; // Используйте Slider от react-native-elements

const API_URL = 'http://192.168.178.38/action';
const API_URL_IMG = 'http://192.168.178.38:81/stream'; // URL потока изображений

const Joystick: React.FC = () => {
  ////// STREAM

  ////// STREAM
  const [sliderValue, setSliderValue] = useState(0);

  useEffect(() => {
    sendSliderCommand(sliderValue);
  }, [sliderValue]); // Отслеживаем sliderValue

  const sendSliderCommand = async (value: number) => {
    try {
      const command = `SL,${value}`;
      await axios.get(`${API_URL}?go=${command}`);
      console.log(`Команда отправлена: ${command}`);
    } catch (error) {
      console.error(`Ошибка при отправке команды: ${error}`);
    }
  };
  const handleSliderChange = (value: number) => {
    setSliderValue(value);
  };

  // Функция для отправки запроса в зависимости от направления
  const sendCommand = async (direction: string) => {
    try {
      await axios.get(`${API_URL}?go=${direction}`);
      console.log(`Команда отправлена: ${direction}`);
    } catch (error) {
      const axiosError = error as AxiosError; // Приведение к типу AxiosError

      console.error(`Ошибка при отправке команды: ${direction}`);
      if (axiosError.response) {
        // Сервер вернул ответ с ошибкой (например, 404, 500 и т.д.)
        console.error('Response error data:', axiosError.response.data);
        console.error('Response status:', axiosError.response.status);
        console.error('Response headers:', axiosError.response.headers);
      } else if (axiosError.request) {
        // Запрос был отправлен, но ответа нет
        console.error('Request error:', axiosError.request);
      } else {
        // Ошибка в настройке запроса
        console.error('Error', axiosError.message);
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Значение: {sliderValue}</Text>
      <Slider
        minimumValue={0}
        maximumValue={10}
        step={1}
        value={sliderValue}
        onValueChange={handleSliderChange}
        style={styles.slider}
      />

      <Text style={styles.title}>Live Video Stream</Text>
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: API_URL_IMG }} // Используйте URL потока
          style={styles.image}
          resizeMode="contain" // Убедитесь, что изображение будет правильно масштабироваться
        />
      </View>

      {/* Кнопки управления */}
      <View style={styles.row}>
        <TouchableOpacity
          style={styles.directionButton}
          onPressIn={() => sendCommand('B,L')} // Команда отправляется при нажатии
          onPressOut={() => sendCommand('STOP')} // Команда "STOP" отправляется при отпускании
        >
          <Text style={styles.stopButtonText}>Лево</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.directionButton}
          onPressIn={() => sendCommand('B,F')} // Команда отправляется при нажатии
          onPressOut={() => sendCommand('STOP')} // Команда "STOP" отправляется при отпускании
        >
          <Text style={styles.stopButtonText}>Вперёд</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.directionButton}
          onPressIn={() => sendCommand('B,R')} // Команда отправляется при нажатии
          onPressOut={() => sendCommand('STOP')} // Команда "STOP" отправляется при отпускании
        >
          <Text style={styles.stopButtonText}>Вправо</Text>
        </TouchableOpacity>
      </View>

      {/* Кнопка "Стоп" по центру */}
      <View style={styles.center}>
        <TouchableOpacity
          style={styles.stopButton}
          onPressIn={() => sendCommand('STOP')} // Команда отправляется при нажатии
          onPressOut={() => sendCommand('STOP')} // Команда "STOP" отправляется при отпускании
        >
          <Text style={styles.stopButtonText}>СТОП</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={styles.directionButton}
        onPressIn={() => sendCommand('B,B')} // Команда отправляется при нажатии
        onPressOut={() => sendCommand('STOP')} // Команда "STOP" отправляется при отпускании
      >
        <Text style={styles.stopButtonText}>Назад</Text>
      </TouchableOpacity>
    </View>
  );
};

// Стили для расположения кнопок джойстика и центральной кнопки "Стоп"
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  webview: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  slider: {
    width: '80%',
    height: 40,
  },

  image: {
    width: 320,
    height: 240,
  },

  imageContainer: {
    borderWidth: 1, // Ширина рамки
    borderColor: 'black', // Цвет рамки
    borderRadius: 5, // Радиус углов (опционально)
    marginBottom: 10,
  },
  row: {
    flexDirection: 'row',
    marginBottom: 10,
    gap: 10,
  },
  button: {
    marginHorizontal: 10,
  },
  center: {
    marginVertical: 20,
  },
  stopButton: {
    width: 100,
    height: 100,
    backgroundColor: 'red',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 50,
    elevation: 5, // Добавим тень на Android
  },
  stopButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 18,
  },
  directionButton: {
    padding: 6,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',

    elevation: 5, // Добавим тень на Android
  },
});

export default Joystick;
