/**
 * @jest-environment jsdom
 */

import { fireEvent, screen, waitFor } from "@testing-library/dom"
import NewBillUI from "../views/NewBillUI.js"
import NewBill from "../containers/NewBill.js"
import { localStorageMock } from "../__mocks__/localStorage.js";
import { ROUTES_PATH, ROUTES } from "../constants/routes.js";
import mockStore from "../__mocks__/store"


jest.mock("../app/store", () => mockStore)


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

  describe("When I do fill fields in correct format and I click on submit button", () => {
    test("Then it should create a new bill", async () => {
    
      const html = NewBillUI()
      document.body.innerHTML = html
      
      
      // simule des donneés dans le localStorage
      Object.defineProperty(window, "localStorage", {
        value: localStorageMock,
      })
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

      // création de ma class qui gère la page
      const billsContainer = new NewBill({
        document,
        onNavigate,
        store: mockStore,
        localStorage: localStorageMock
      });
      
      const expenseType = screen.getByTestId("expense-type")
      fireEvent.change(expenseType, {target: { value: "Transports"}})
      expect(expenseType.value).toBe('Transports')

      const expenseName = screen.getByTestId("expense-name")
      fireEvent.change(expenseName, {target: { value: "toto"}})
      expect(expenseName.value).toBe('toto')

      const datepicker = screen.getByTestId("datepicker")
      fireEvent.change(datepicker, {target: { value: "2024-03-07"}})
      expect(datepicker.value).toBe('2024-03-07')
      
      const amount = screen.getByTestId("amount")
      fireEvent.change(amount, {target: { value: "123"}})
      expect(amount.value).toBe('123')

      const vat = screen.getByTestId("vat")
      fireEvent.change(vat, {target: { value: "70"}})
      expect(vat.value).toBe('70')

      const pct = screen.getByTestId("pct")
      fireEvent.change(pct, {target: { value: "20"}})
      expect(pct.value).toBe('20')

      const commentary = screen.getByTestId("commentary")
      fireEvent.change(commentary, {target: { value: "Lorem ipsum..."}})
      expect(commentary.value).toBe('Lorem ipsum...')

      const file = new File(['okokokok'], 'toto.jpg', {type: 'image/jpg'})
      const expenseFile = screen.getByTestId('file')

      Object.defineProperty(expenseFile, 'files', {
        value: [file]
      })

      /////////changement de fichier dans la partie "justificatif"
      const handleChangeFile = jest.fn(billsContainer.handleChangeFile)

      expenseFile.addEventListener('change', handleChangeFile)
      fireEvent.change(expenseFile)

      expect(handleChangeFile).toHaveBeenCalled()

      /////////lancement de la fonction handleSubmit
      const newBillForm = screen.getByTestId("form-new-bill");
      const handleSubmit = jest.fn(billsContainer.handleSubmit);

      newBillForm.addEventListener('submit', handleSubmit)
      fireEvent.submit(newBillForm)

      expect(handleSubmit).toHaveBeenCalled()

      /////////nouvelle note de frais présente dans la liste
      billsContainer.onNavigate(ROUTES_PATH['Bills'])
      await waitFor(() => screen.queryByText('Mes notes de frais'))
      const newTestBill = screen.queryByText('Mes notes de frais')
      
      expect(newTestBill).toBeTruthy()
    })
  })
})
