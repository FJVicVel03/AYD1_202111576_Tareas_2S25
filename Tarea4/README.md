# Universidad de San Carlos de Guatemala
## Curso: Análisis y Diseño de Sistemas 1
### Estudiante: Fernando José Vicente Velásquez
### Tarea No.4 — Pruebas E2E (Cypress)

Este repositorio contiene las pruebas end-to-end (E2E) desarrolladas con Cypress para el sitio de demostración SauceDemo (https://www.saucedemo.com). La prueba principal automatiza el flujo: inicio de sesión → seleccionar producto → agregar al carrito → checkout → completar orden.

## Capturas (flujo)

- Login
  - ![L1](/img/login1.png)
  - ![L2](/img/login2.png)
- Selección de producto
  - ![S1](/img/selecc1.png)
  - ![S2](/img/selecc2.png)
  - ![S3](/img/selecc3.png)
- Agregar al carrito
  - ![A1](/img/agg1.png)
  - ![A2](/img/agg2.png)
- Checkout
  - ![C1](/img/check1.png)
  - ![C2](/img/check2.png)
  - ![C3](/img/check3.png)
- Completar orden
  - ![CO1](/img/comp1.png)
  - ![CO2](/img/comp2.png)
  - ![CO3](/img/comp3.png)
  - ![CO4](/img/comp4.png)

## Requisitos

- Node.js (>= 12) y npm
- Navegador Chromium/Chrome o Firefox (Cypress lo instalará localmente)

Nota: Se asume que se tiene acceso a internet para descargar dependencias y que puedes abrir un navegador desde la máquina de desarrollo.

## Instalación rápida

1. Abrir una terminal en la carpeta del proyecto (`Tarea4`).
2. Instalar dependencias (si `package.json` ya existe dentro de `cypress/`):

```powershell
cd cypress
npm install
```

Si no existe `package.json` dentro de `cypress/`, se debe inicializar el proyecto y luego instalar Cypress:

```powershell
cd cypress
npm init -y
npm install cypress --save-dev
```

## Ejecutar las pruebas

- Abrir Cypress en modo interactivo (UI):

```powershell
cd cypress
npx cypress open
```

- Ejecutar pruebas desde la línea de comandos (headless):

```powershell
cd cypress
npx cypress run
```

Recomendación: usar `npx cypress open` la primera vez para verificar que Cypress detecta los navegadores y que las pruebas se ejecutan correctamente.

## Estructura del repositorio (relevante)

- `cypress/` — carpeta con configuraciones y tests de Cypress
  - `integration/` — pruebas E2E 
- `img/` — capturas de pantalla usadas en este README
- `README.md` — este documento


## Descripción de la prueba principal

La prueba automatiza el siguiente flujo:

1. Visitar https://www.saucedemo.com
2. Iniciar sesión con `standard_user` / `secret_sauce`
3. Seleccionar el primer producto y agregarlo al carrito
4. Ir al carrito y proceder al checkout
5. Completar el formulario (nombre, apellido, código postal)
6. Finalizar y verificar el mensaje de confirmación

### Código de ejemplo de la prueba E2E

El siguiente fragmento es el código usado para la prueba principal:

```javascript
describe('SauceDemo E2E Test', () => {
  it('Inicia sesión, agrega un producto al carrito y realiza la compra', () => {
    // 1. Visitar la página de SauceDemo
    cy.visit('https://www.saucedemo.com');

    // 2. Iniciar sesión con credenciales de usuario
    cy.get('[data-test="username"]').type('standard_user');
    cy.get('[data-test="password"]').type('secret_sauce');
    cy.get('[data-test="login-button"]').click();

    // 3. Verificar que la navegación fue correcta
    cy.url().should('include', '/inventory.html');

    // 4. Seleccionar un producto y agregarlo al carrito
    cy.get('.inventory_item').first().within(() => {
      cy.get('.btn_inventory').click();
    });

    // 5. Verificar que el producto fue agregado al carrito
    cy.get('.shopping_cart_link').click();
    // Se espera que exista la lista de elementos en el carrito
    cy.get('.cart_list').should('exist');

    // 6. Proceder al checkout
    cy.get('[data-test="checkout"]').click();

    // 7. Completar el formulario de checkout
    cy.get('[data-test="firstName"]').type('Fernando');
    cy.get('[data-test="lastName"]').type('Vicente');
    cy.get('[data-test="postalCode"]').type('202111576'); // Mi carnet
    cy.get('[data-test="continue"]').click();

    // 8. Confirmar la orden
    cy.get('[data-test="finish"]').click();

    // 9. Verificar que el proceso de compra ha sido completado
    cy.contains('Thank you for your order!').should('be.visible');
  });
});
```

## Contacto

Fernando José Vicente Velásquez — 202111576

---



