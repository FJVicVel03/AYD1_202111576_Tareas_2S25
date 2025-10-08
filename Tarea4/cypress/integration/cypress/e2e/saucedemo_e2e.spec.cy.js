describe('SauceDemo E2E Test', () => {
  
  it('Inicia sesión, agrega un producto al carrito y realiza la compra', () => {
    // 1. Visitar la página de SauceDemo
    cy.visit('https://www.saucedemo.com');

    // 2. Iniciar sesión con credenciales de usuario
    cy.get('[data-test="username"]').type('standard_user');
    cy.get('[data-test="password"]').type('secret_sauce');
    cy.get('[data-test="login-button"]').click();

    // 3. Verificar que la página de inicio de sesión sea exitosa
    cy.url().should('include', '/inventory.html');

    // 4. Seleccionar un producto y agregarlo al carrito
    cy.get('.inventory_item').first().within(() => {
      cy.get('.btn_inventory').click();
    });

    // 5. Verificar que el producto fue agregado al carrito
    cy.get('.shopping_cart_link').click();
    cy.get('.cart_list').should('have.length', 1);

    // 6. Proceder al checkout
    cy.get('[data-test="checkout"]').click();

    // 7. Completar el formulario de checkout
    cy.get('[data-test="firstName"]').type('Fernando');
    cy.get('[data-test="lastName"]').type('Vicente');
    cy.get('[data-test="postalCode"]').type('202111576'); //Mi carnet
    cy.get('[data-test="continue"]').click();

    // 8. Confirmar la orden
    cy.get('[data-test="finish"]').click();

    // 9. Verificar que el proceso de compra ha sido completado
    cy.contains('Thank you for your order!').should('be.visible');
  });
});
