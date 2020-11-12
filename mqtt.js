const client = new Paho.MQTT.Client("192.168.0.25", 8888, "myClientId" + new Date().getTime());

const myTopic = "demo_topic";
const ledTopic = "inTopic";
const outTopic = "outTopic";

client.onConnectionLost = onConnectionLost;
client.onMessageArrived = onMessageArrived;

client.connect({ onSuccess: onConnect });

let count = 0;
function onConnect() {
  console.log("onConnect");
  client.subscribe(myTopic);
  // client.subscribe(ledTopic);
  client.subscribe(outTopic);
  // client.subscribe(dataTopic);
  setInterval(() => { publish(myTopic, `The count is now ${count++}`) }, 1000)
  // setInterval(()=>{
  //   publish(ledTopic, '1')
  // }, 5000)
}
function turnLed(state) {
  let message = new Paho.MQTT.Message(state);
  // console.log('this is essage mqtt: ', message)
  message.destinationName = ledTopic;
  client.send(message);
}

function onConnectionLost(responseObject) {
  if (responseObject.errorCode !== 0) {
    console.log("onConnectionLost:" + responseObject.errorMessage);
  }
  client.connect({ onSuccess: onConnect });
}

const publish = (dest, msg) => {
  console.log('desint :', dest, 'msggg', msg)
  let message = new Paho.MQTT.Message(msg);
  // console.log('this is essage mqtt: ', message)
  message.destinationName = dest;
  client.send(message);
}

function onMessageArrived(message) {
  // console.log('mes ar', message)
  
  let el = document.createElement('div')
  el.innerHTML = message.payloadString
  document.body.appendChild(el)
  if(message.destinationName == 'test9999/led'){
    console.log('Светодиод', message.payloadString)
  }
}