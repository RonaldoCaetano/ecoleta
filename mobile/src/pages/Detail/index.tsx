import React, { useState, useEffect } from 'react'
import { View, Image, Text, SafeAreaView, Linking } from 'react-native'
import { TouchableOpacity, RectButton } from 'react-native-gesture-handler'
import { Feather as Icon, FontAwesome } from '@expo/vector-icons'
import { useNavigation, useRoute } from '@react-navigation/native'
import * as MailComposer from 'expo-mail-composer'

import api from './../../services/api'
import styles from './styles'

interface RouteParams {
	pointId: number
}

interface PointData {
	point: {
		image: string
		name: string
		email: string
		whatsapp: string
		city: string
		uf: string
	}
	items: {
		title: string
	}[]
}

const Detail = () => {
	const navigation = useNavigation()
	const route = useRoute()

	const [pointData, setPointData] = useState<PointData>({} as PointData)

	const routeParams = route.params as RouteParams

	useEffect(() => {
		api.get(`points/${routeParams.pointId}`).then(({ data }) => {
			setPointData(data)
		})
	}, [])

	function handleNavigateBack() {
		navigation.goBack()
	}

	function handleComposeMail() {
		MailComposer.composeAsync({
			recipients: [pointData.point.email],
			subject: 'Interesse na coleta de resíduos',
		})
	}

	function handleWhatsapp() {
		Linking.openURL(`whatsapp://send?phone=${pointData.point.whatsapp}&text=Interesse na coleta de resíduos`)
	}

	if (!pointData.point) {
		return null
	}

	return (
		<SafeAreaView style={{ flex: 1 }}>
			<View style={styles.container}>
				<TouchableOpacity onPress={handleNavigateBack}>
					<Icon name="arrow-left" size={20} color="#34cb79" />
				</TouchableOpacity>

				<Image style={styles.pointImage} source={{ uri: pointData.point.image }} />

				<Text style={styles.pointName}>{pointData.point.name}</Text>

				<Text style={styles.pointItems}>{pointData.items.map((item) => item.title).join(', ')}</Text>

				<View style={styles.address}>
					<Text style={styles.addressTitle}>Endereco</Text>
					<Text style={styles.addressContent}>
						{pointData.point.city}, {pointData.point.uf}
					</Text>
				</View>

				<View>
					<RectButton style={styles.button} onPress={handleWhatsapp}>
						<FontAwesome name="whatsapp" size={20} color="#fff" />
						<Text style={styles.buttonText}>Whatsapp</Text>
					</RectButton>
					<RectButton style={styles.button} onPress={handleComposeMail}>
						<FontAwesome name="mail" size={20} color="#fff" />
						<Text style={styles.buttonText}>E-mail</Text>
					</RectButton>
				</View>
			</View>
		</SafeAreaView>
	)
}

export default Detail
