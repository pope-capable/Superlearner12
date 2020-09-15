import React from 'react'
import Navbar from "../common/Navbar"
import robot from "../assets/images/robot.png"
import med from "../assets/images/micro.png"
import power from "../assets/images/power.png"
import space from "../assets/images/tele.png"
import wind from "../assets/images/wind.png"
import graph from "../assets/images/growth.png"



import "../styles/home.css"

function Home() {
    return (
        <div className = "home">
          <Navbar />
          <section className = "section-1">
            <div className = "main-content">
              <div className = "super">Super Learner is an online machine learning tool that provides 99.99% accuracy on medical diagnosis of clinical issues in infants</div>
              <div className = "advantage">Take advantage of the system defined models or go a step further by building your own models.</div>
              <button className = "get-started">Get started</button>
            </div>
            <div>
              <img src = {robot} />
            </div>
          </section>
          <section className = "section-2">
          <div className = "one-application">
              <img src = {med} />
              <div className = "application-title">Medical</div>
              <div className = "application-text">
              Super learner was designed for clinical use, it dignoses certian diseases in infants with an unparalleled accuracy
              </div>
            </div>
            <div className = "one-application">
              <img src = {wind} />
              <div className = "application-title">Weather</div>
              <div className = "application-text">
              A very useful tool in construction and energy generation, models can be modified to produce certain results before commitement
              </div>
            </div>
            <div className = "one-application">
              <img src = {power} />
              <div className = "application-title">Industry</div>
              <div className = "application-text">
                Weather prediction is a useful application of the cluster mapping model
              </div>
            </div>
            <div className = "one-application">
              <img src = {space} />
              <div className = "application-title">Space Exploration</div>
              <div className = "application-text">
                Space exploration can be made a lot more efficient by mmodel activivties before D-day, this enables enginners mitigate fail points.
              </div>
            </div>
          </section>
          <section className = "section-3">
            <div>

            </div>
            <img className = "graph" src = {graph} />
            <div>
              <div className = "report">Reports</div>
              <div className = "report-meaning">Our report feature enables user export report into a PDF document which can be read easily post simulation, this ensures that time can be taken off the system to analyse data, users are also able to share reports with other connected super learner users</div>
            </div>
          </section>
        </div>
    )
}

export default Home
