describe("render the homepage, create an account and make a post", () => {
  it("renders correctly", () => {
    cy.visit("http://localhost:3000/");
    cy.get(".create-account__button").should("exist").click();
    cy.url().should("include", "/create-account");
    cy.get('input[name="alias"]').type("challemanneN3");
    cy.get('input[name="password"]').type("password123");
    cy.get('input[name="confirmPassword"]').type("password123");
    cy.get('form button[type="submit"]').click();
    cy.get("#add__button").click();
    cy.get(".comment__input").type("tjena soffan :P");
    cy.get(".feed-submit__button").click();
  });
});
