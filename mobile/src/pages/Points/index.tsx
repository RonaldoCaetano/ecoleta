import React, { useState, useEffect } from 'react'
import { View, TouchableOpacity, Text, ScrollView, Image, Alert } from 'react-native'
import { Feather as Icon } from '@expo/vector-icons'
import { useNavigation, useRoute } from '@react-navigation/native'
import MapView, { Marker } from 'react-native-maps'
import { SvgUri } from 'react-native-svg'
import * as Location from 'expo-location'

import api from './../../services/api'
import styles from './styles'

interface Item {
	id: number
	title: string
	imageUrl: string
}

interface Point {
	id: number
    image: string
    image_url: string
	name: string
	latitude: number
	longitude: number
}

interface RouteParams {
	uf: string
	city: string
}

const Points = () => {
	const [items, setItems] = useState<Item[]>([])
	const [points, setPoints] = useState<Point[]>([])
	const [selectedItems, setSelectedItems] = useState<number[]>([])
	const [initialPosition, setInitialPosition] = useState<[number, number]>([0, 0])
	const navigation = useNavigation()
	const route = useRoute()

	const routeParams = route.params as RouteParams

	useEffect(() => {
		api.get('items').then(({ data }) => {
			setItems(data)
		})
	}, [])

	useEffect(() => {
		async function loadPosition() {
			const { status } = await Location.requestPermissionsAsync()

			if (status !== 'granted') {
				Alert.alert('Precisamos de sua informação para obter sua localização')
			}

			const location = await Location.getCurrentPositionAsync()
			const { latitude, longitude } = location.coords
			setInitialPosition([latitude, longitude])
		}

		loadPosition()
	}, [])

	useEffect(() => {
		api.get('points', {
			params: {
				city: routeParams.city,
				uf: routeParams.uf,
				items: selectedItems,
			},
		}).then(({ data }) => {
			setPoints(data)
		})
	}, [selectedItems])

	function handleNavigateBack() {
		navigation.goBack()
	}

	function handleNavigateToDetail(pointId: number) {
		navigation.navigate('Detail', { pointId })
	}

	function handleSelectItem(id: number) {
		const alreadySelected = selectedItems.findIndex((item) => item === id)

		if (alreadySelected >= 0) {
			const filteredItems = selectedItems.filter((item) => item !== id)
			setSelectedItems(filteredItems)
		} else {
			setSelectedItems([...selectedItems, id])
		}
	}

	return (
		<>
			<View style={styles.container}>
				<TouchableOpacity onPress={handleNavigateBack}>
					<Icon name="arrow-left" size={20} color="#34cb79" />
				</TouchableOpacity>

				<Text style={styles.title}>Bem vindo.</Text>

				<Text style={styles.description}>Encontre no mapa um ponto de coleta.</Text>

				<View style={styles.mapContainer}>
					{initialPosition[0] !== 0 && (
						<MapView
							style={styles.map}
							initialRegion={{
								latitude: initialPosition[0],
								longitude: initialPosition[1],
								latitudeDelta: 0.014,
								longitudeDelta: 0.014,
							}}
						>
							{points.map((point, index) => (
								<Marker
									key={String(index)}
									style={styles.mapMarker}
									onPress={() => handleNavigateToDetail(point.id)}
									coordinate={{
										latitude: point.latitude,
										longitude: point.longitude,
									}}
								>
									<View style={styles.mapMarkerContainer}>
										<Image style={styles.mapMarkerImage} source={{ uri: point.image_url }} />
										<Text style={styles.mapMarkerTitle}>{point.name}</Text>
									</View>
								</Marker>
							))}
						</MapView>
					)}
				</View>
			</View>
			<View style={styles.itemsContainer}>
				<ScrollView
					horizontal
					showsHorizontalScrollIndicator={false}
					contentContainerStyle={{
						paddingHorizontal: 20,
					}}
				>
					{items.map((item, index) => (
						<TouchableOpacity
							style={[styles.item, selectedItems.includes(item.id) ? styles.selectedItem : {}]}
							key={String(index)}
							onPress={() => handleSelectItem(item.id)}
							activeOpacity={0.6}
						>
							<SvgUri uri={item.imageUrl} width={42} height={42} />
							<Text style={styles.itemTitle}>{item.title}</Text>
						</TouchableOpacity>
					))}
				</ScrollView>
			</View>
		</>
	)
}

export default Points
