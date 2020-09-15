import React from 'react'
import Navbar from "../common/Navbar"
import Authentication from "../common/Auth"
import "../styles/entry.css"


function Entry(props) {
    return (
        <div className = "entry">
            <Navbar showEntry = {true} />
            <section className = "pillar">
                <Authentication goto = {props.match.params.pp} />
            </section>
        </div>
    )
}

export default Entry