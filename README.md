# OrderFlow Integration Hub - API Backend (Node.js + TypeScript)

Backend API desarrollado con Node.js y TypeScript, enfocado en integraciones de órdenes, procesamiento de webhooks, manejo de errores y reintentos automatizados hacia sistemas externos.

---

## Descripción

API backend diseñada para recibir órdenes desde diferentes fuentes mediante webhooks, procesarlas y enviarlas a sistemas externos de forma confiable.

Incluye manejo de errores, reintentos manuales, trazabilidad completa mediante logs y métricas en tiempo real, simulando un sistema de integración tipo middleware productivo.

Permite integrarse fácilmente con aplicaciones web, e-commerce, ERPs o plataformas SaaS.

---

## Features

- Recepción de órdenes vía webhook  
- Procesamiento y transformación de datos  
- Integración con APIs externas  
- Manejo estructurado de errores  
- Sistema de retry manual  
- Logs por evento (trazabilidad completa)  
- Métricas en tiempo real  
- Documentación interactiva con Swagger  
- Arquitectura modular escalable  
- Health check para monitoreo  

---

## Tecnologías

- Node.js  
- TypeScript  
- Express  
- Prisma ORM  
- PostgreSQL  
- Swagger (OpenAPI)  
- Axios  
- Zod  

---

## Instalación

~~~bash
git clone https://github.com/TU_USER/orderflow-integration-api.git
cd orderflow-integration-api
npm install
~~~

---

## Variables de entorno

Crear archivo `.env` en la raíz del proyecto:

~~~env
PORT=3000
DATABASE_URL=postgresql://user:password@localhost:5432/orderflow
EXTERNAL_API_URL=http://localhost:4000/mock-api
~~~

---

## Ejecutar API

~~~bash
npm run dev
~~~

---

## Endpoints

### Health

- GET /api/health

### Webhooks

- POST /api/webhooks/orders

### Orders

- GET /api/orders  
- GET /api/orders/:id  
- GET /api/orders/:id/logs  
- POST /api/orders/:id/retry  

### Metrics

- GET /api/metrics/summary

---

## Ejemplo de uso

POST /api/webhooks/orders

~~~json
{
  "source": "web-store",
  "customer": {
    "name": "Juan Perez",
    "email": "juan@test.com"
  },
  "items": [
    {
      "sku": "SKU-1",
      "name": "Producto 1",
      "quantity": 1,
      "price": 500
    }
  ],
  "total": 500,
  "currency": "MXN"
}
~~~

Respuesta:

~~~json
{
  "success": true,
  "message": "Order received",
  "data": {
    "id": "uuid",
    "status": "RECEIVED"
  }
}
~~~

---

## Casos de uso

- Integraciones de e-commerce con sistemas externos  
- Middleware para procesamiento de órdenes  
- Automatización de flujos entre APIs  
- Sistemas con retry y tolerancia a fallos  

---

## Estructura del proyecto

src/
  controllers/
  routes/
  services/
  repositories/
  middlewares/
  config/
  types/

---

## Notas

- Incluye simulación de API externa para pruebas  
- Soporta manejo de errores y reintentos manuales  
- Diseñado para integraciones reales tipo microservicios  
- Puede escalarse para múltiples flujos de integración  

---

## Autor

Martin Hernandez  
Backend Developer especializado en APIs, microservicios e integraciones  
