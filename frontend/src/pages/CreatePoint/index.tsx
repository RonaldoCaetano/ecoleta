import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react'
import { Link, useHistory } from 'react-router-dom'
import { FiArrowLeft } from 'react-icons/fi'
import { Map, TileLayer, Marker } from 'react-leaflet'

import { LeafletMouseEvent } from 'leaflet'

import axios from 'axios';

import api from '../../services/api'

import './styles.css'

import logo from './../../assets/logo.svg'

interface Item {
    id: number
    title: string
    image_url: string
}

interface IBGEUFResponse {
    sigla: string
}

interface IBGECityResponse {
    nome: string
}

const CreatePoint = () => {

    const history = useHistory()

    const [items, setitems] = useState<Item[]>([])
    const [ufs, setUfs] = useState<string[]>([])
    const [selectedUf, setSelectedUf] = useState('0')

    const [cities, setCities] = useState<string[]>([])
    const [selectedCity, setSelectedCity] = useState('0')

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        whatsapp: ''
    })

    const [selectedItems, setSelectedItems] = useState<number[]>([])

    const [initialPosition, setinitialPosition] = useState<[number, number]>([0, 0])

    const [selectedPosition, setSelectedPosition] = useState<[number, number]>([0, 0])

    useEffect(() => {
        axios.get<IBGEUFResponse[]>(`https://servicodados.ibge.gov.br/api/v1/localidades/estados`).then(response => {
            const ufInitials = response.data.map((uf) => uf.sigla)
            setUfs(ufInitials)
        })
    }, [])

    useEffect(() => {
        if (selectedUf === '0') return

        axios.get<IBGECityResponse[]>(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedUf}/municipios`).then(({data}) => {
            const cityNames = data.map((city) => city.nome)
            setCities(cityNames)
        })
    }, [selectedUf])

    useEffect(() => {
        api.get('items').then(response => {
            setitems(response.data)
        })
    }, [])

    useEffect(() => {
        navigator.geolocation.getCurrentPosition(position => {
            const { coords } = position
            setinitialPosition([
                coords.latitude,
                coords.longitude
            ])
        })
    }, [])

    function handleSelectUf(ev: ChangeEvent<HTMLSelectElement>) {
        const { target: { value } } = ev

        setSelectedUf(value)
    }

    function handleSelectCity(ev: ChangeEvent<HTMLSelectElement>) {
        const { target: { value } } = ev

        setSelectedCity(value)
    }

    function handleMapClick(ev: LeafletMouseEvent) {
        setSelectedPosition([
            ev.latlng.lat,
            ev.latlng.lng
        ])
    }

    function handleInputChange(ev: ChangeEvent<HTMLInputElement>) {
        const { name, value } = ev.target
        setFormData({
            ...formData,
            [name]: value
        })
    }

    function handleSelectItem(id: number) {

        const alreadySelected = selectedItems.findIndex(item => item === id)

        if (alreadySelected >= 0) {
            const filteredItems = selectedItems.filter(item => item !== id)
            setSelectedItems(filteredItems)
        } else {
            setSelectedItems([ ...selectedItems, id ])
        }
    }

    async function handleSubmit(ev: FormEvent<HTMLFormElement>) {
        ev.preventDefault()

        const { name, email, whatsapp } = formData
        const uf = selectedUf
        const city = selectedCity
        const [ latitude, longitude ] = selectedPosition
        const items = selectedItems

        const data = {
            name,
            email,
            whatsapp,
            uf,
            city,
            latitude,
            longitude,
            items
        }

        await api.post('points', data)

        history.push('/')
    }

    return (
        <div id="page-create-point">
            <header>
                <img src={logo} alt="Ecoleta" />

                <Link to="/">
                    <FiArrowLeft />
                    Voltar para home
                </Link>
            </header>

            <form onSubmit={handleSubmit}>
                <h1>Cadastro do ponto de coleta</h1>
                <fieldset>
                    <legend>
                        <h2>Dados</h2>
                    </legend>

                    <div className="field">
                        <label htmlFor="name">Nome da entidade</label>
                        <input type="text" name="name" id="name" onChange={handleInputChange}  />
                    </div>
                    <div className="field-group">
                        <div className="field">
                            <label htmlFor="email">E-mail</label>
                            <input type="email" name="email" id="email" onChange={handleInputChange} />
                        </div>

                        <div className="field">
                            <label htmlFor="whatsapp">Whatsapp</label>
                            <input type="text" name="whatsapp" id="whatsapp" onChange={handleInputChange}  />
                        </div>
                    </div>

                </fieldset>
                <fieldset>
                    <legend>
                        <h2>Endereço</h2>
                        <span>Selecione o endereço no mapa</span>
                    </legend>

                    <Map 
                        center={initialPosition}
                        zoom={15}    
                        onClick={handleMapClick}
                    >
                        <TileLayer
                            attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />

                        <Marker 
                            position={selectedPosition}
                        />
                    </Map>

                    <div className="field-group">
                        <div className="field">
                            <label htmlFor="city">Estado (UF)</label>
                            <select value={selectedUf} onChange={(ev) => handleSelectUf(ev)} name="uf" id="uf">
                                <option value="0">Seleciona uma UF</option>
                                {ufs.map((uf, index) => (
                                    <option value={uf} key={index}>{uf}</option>
                                ))}
                            </select>
                        </div>

                        <div className="field">
                            <label htmlFor="city">Cidade</label>
                            <select 
                                name="city" 
                                value={selectedCity} 
                                onChange={(ev) => handleSelectCity(ev)} id="city"
                            >
                                <option value="0">Seleciona uma cidade</option>
                                {cities.map((city, index) => (
                                    <option value={city} key={index}>{city}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                </fieldset>
                <fieldset>
                    <legend>
                        <h2>Ítens de coleta</h2>
                        <span>Selecione um ou mais ítens abaixo</span>
                    </legend>

                    <ul className="items-grid">
                        {items.map((item, index: number) => (
                            <li 
                                key={index} 
                                onClick={() => handleSelectItem(item.id)}
                                className={selectedItems.includes(item.id) ? 'selected' : ''}
                            >
                                <img src={item.image_url} alt={item.title}/>
                                <span>{item.title}</span>
                            </li>
                        ))}
                    </ul>
                </fieldset>

                <button type="submit">
                    Cadastrar ponto de coleta
                </button>
            </form>
        </div>
    )
}

export default CreatePoint