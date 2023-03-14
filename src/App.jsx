import { useState } from 'react'
import APIForm from './Components/APIform';
import './App.css'
import Gallery from './Components/gallery';

function App() {
  const [inputs, setInputs] = useState({
    url: "",
    width: "",
    height: "",
  });
  const [currentImage, setCurrentImage] = useState(null);
  const [prevImages, setPrevImages] = useState([]);


  
  const inputsInfo = [
    "Input a link to any website you would like to take a screenshot of. Do not include https or any protocol in the URL",
    "Choose the width of your screenshot (in pixels)",
    "Choose the height of your screenshot (in pixels)",
  ];
  const ACCESS_KEY = import.meta.env.VITE_APP_ACCESS_KEY;
  
  const submitForm = () => {
    let defaultValues = {
        format: "jpeg",
        width: "1920",
        height: "1080",
    };
    
    if (inputs.url == "" || inputs.url == " ") {
      alert("You forgot to submit an url!");
    } else {
      for (const [key, value] of Object.entries(inputs)) {
        if (value == ""){
          inputs[key] = defaultValues[key]
        }
      }
    }
    makeQuery();
  }
  
  const makeQuery = () => {
    let wait_until = "network_idle";
    let response_type = "json";
    let fail_on_status = "400%2C404%2C500-511";
    let url_starter = "https://";
    let fullURL = url_starter + inputs.url;
    let query = `https://api.apiflash.com/v1/urltoimage?access_key=${ACCESS_KEY}&url=${fullURL}&width=${inputs.width}&height=${inputs.height}&wait_until=${wait_until}&response_type=${response_type}&fail_on_status=${fail_on_status}`;
    callAPI(query).catch(console.error, console.log(query));

  }

  const callAPI = async (query) => {
    const response = await fetch(query);
    const json = await response.json();
    if (json.url == null){
      alert("Oops! Something went wrong with that query, let's try again!")
        }
    else {
      setCurrentImage(json.url);
      setPrevImages((images) => [...images, json.url]);
      reset();
    }
  
  const reset = () => {
      setInputs({
        url: "",
        width: "",
        height: "",
      });
      
    }

  }
  return (
    <div className="App">
       <h1>Build Your Own Screenshot! 📸</h1>
      
      <APIForm
        inputs={inputs}
        handleChange={(e) =>
          setInputs((prevState) => ({
            ...prevState,
            [e.target.name]: e.target.value.trim(),
          }))
        }
        onSubmit={submitForm}
        inputsInfo={inputsInfo}
      />
      <br></br>
      {currentImage ? (
        <img
          className="screenshot"
          src={currentImage}
          alt="Screenshot returned"
        />
      ) : (
        <div></div>
      )}
      <div className="container">
        <h3> Current Query Status: </h3>
        <p>
          https://api.apiflash.com/v1/urltoimage?access_key=ACCESS_KEY    
          <br></br>
          &url={inputs.url} <br></br>
          &width={inputs.width}<br></br>
          &height={inputs.height}
        </p>
      </div>
      <div className="container">
          <Gallery images={prevImages} />
      </div>
    </div>
  )
}

export default App
