/**
 * @jest-environment jsdom
 */

import { screen, waitFor } from "@testing-library/dom"
import NewBillUI from "../views/NewBillUI.js"
import NewBill from "../containers/NewBill.js"
import { localStorageMock } from "../__mocks__/localStorage.js";
import { ROUTES_PATH, ROUTES } from "../constants/routes.js";






describe("Given I am connected as an employee", () => {
  describe("When I am on NewBill Page", () => {
    test("Then new bill form should appear", async () => {
      //to-do write assertion
      
      const html = NewBillUI()
      document.body.innerHTML = html
      
       // simule des donneés dans le localStorage
       Object.defineProperty(window, localStorage, {
        value: localStorageMock,
      });
      // simule un employé connecté
      window.localStorage.setItem(
        "user",
        JSON.stringify({
          type: "Employee",
        })
      );

      // we have to mock navigation to test it
      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname });
      };

      // mock le store
      const store = jest.fn();

      // création de ma class qui gère la page
      const billsContainer = new NewBill({
        document,
        onNavigate,
        store,
        localStorage: localStorageMock,
      });
      
      await waitFor(() => screen.queryByText('Envoyer une note de frais'))
      const newBillForm = screen.queryByText('Envoyer une note de frais')
      
      expect(newBillForm).toBeTruthy()
    })

    
  })
})
