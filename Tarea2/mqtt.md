graph TD
    A[Publisher - Sensor de temperatura] -->|Mensaje en Topic /casa/temperatura| B((Broker MQTT))
    C[Publisher - Sensor de humedad] -->|Mensaje en Topic /casa/humedad| B
    B -->|Distribuye mensajes| D[Subscriber - App Móvil]
    B -->|Distribuye mensajes| E[Subscriber - Dashboard Web]
