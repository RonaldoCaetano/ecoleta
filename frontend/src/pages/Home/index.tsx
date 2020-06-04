import React from 'react'
import { FiLogIn } from 'react-icons/fi'

import logo from '../../assets/logo.svg'

import './styles.css'

const Home = () => {
    return (
        <div id="page-home">
            <div className="content">
                <header>
                    <img src={logo} alt="Ecoleta" />
                </header>
                <main>
                    <h1>Seu marketplace de coleta de resíduos</h1>
                    <p>Ajudamos pessoas a encontrarem pontos de coleta de forma efeciente.</p>

                    <a href="/">
                        <span>{FiLogIn}</span>
                        <strong>Cadastre um ponto de coleta</strong>
                    </a>
                </main>
            </div>
        </div>
    )
}

export default Home