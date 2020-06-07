import React, { useState } from 'react'
import { View, ImageBackground, Image, Text, KeyboardAvoidingView, Platform } from 'react-native'

import { Feather as Icon } from '@expo/vector-icons'

import { RectButton, TextInput } from 'react-native-gesture-handler'
import { useNavigation } from '@react-navigation/native'

import styles from './styles'

const Home = () => {

    const navigation = useNavigation()
    const [uf, setUf] = useState<string>('')
    const [city, setCity] = useState<string>('')

    function handleNavigateToPoints() {
        navigation.navigate('Points', { uf, city })
    }

    return (
        <KeyboardAvoidingView 
            style={{ flex: 1 }}
            behavior={ Platform.OS === 'ios' ? 'padding' : undefined }
        >
            <ImageBackground 
                source={require('../../assets/home-background.png')} 
                imageStyle={{ width: 274, height: 368 }}
                style={styles.container}
            >
                <View style={styles.main}>
                    <Image source={require('../../assets/logo.png')} />

                    <View>
                        <Text style={styles.title}>Seu marketplace de coleta de resíduos</Text>
                        <Text style={styles.description}>Ajudamos pessoas a encontrarem pontos de coleta de forma eficiente</Text>
                    </View>

                    <View style={styles.footer}>
                        <TextInput 
                            style={styles.input}
                            placeholder="Digite a UF"
                            maxLength={2}
                            value={uf}
                            autoCapitalize="characters"
                            autoCorrect={false}
                            onChangeText={setUf}
                        />
                        <TextInput 
                            style={styles.input}
                            value={city}
                            placeholder="Digite a cidade"
                            autoCorrect={false}
                            onChangeText={setCity}
                        />
                        <RectButton style={styles.button} onPress={handleNavigateToPoints}>
                            <View style={styles.buttonIcon}>
                                <Text>
                                    <Icon name="arrow-right" color="#fff" size={24} />
                                </Text>
                            </View>
                            <Text style={styles.buttonText}>Entrar</Text>
                        </RectButton>
                    </View>
                </View>
            </ImageBackground>
        </KeyboardAvoidingView>
    )
}

export default Home