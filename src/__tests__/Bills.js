/**
 * @jest-environment jsdom
 */

import {screen, waitFor, fireEvent} from "@testing-library/dom"
import BillsUI from "../views/BillsUI.js"
import { bills } from "../fixtures/bills.js"
import { ROUTES_PATH, ROUTES} from "../constants/routes.js";
import {localStorageMock} from "../__mocks__/localStorage.js";

import router from "../app/Router.js";
import userEvent from "@testing-library/user-event";
import Bills from '../containers/Bills.js'

describe("Given I am connected as an employee", () => {
  describe("When I am on Bills Page", () => {
    test("Then bill icon in vertical layout should be highlighted", async () => {

      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Employee'
      }))
      const root = document.createElement("div")
      root.setAttribute("id", "root")
      document.body.append(root)
      router()
      window.onNavigate(ROUTES_PATH.Bills)
      await waitFor(() => screen.getByTestId('icon-window'))
      const windowIcon = screen.getByTestId('icon-window')
      //to-do write expect expression
      expect(windowIcon).toBeTruthy()
    })
    test("Then bills should be ordered from earliest to latest", () => {
      // créer la page
      document.body.innerHTML = BillsUI({ data: bills })
      
      // récupérer les dates qui sont affichées sur la page
      const dates = screen.getAllByText(/^(19|20)\d\d[- /.](0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01])$/i).map(a => a.innerHTML)

      // crééer une fonction ==> SUR ET CERTAIN QU'ELLE FONCTIONNE
      const antiChrono = (a, b) => ((a < b) ? 1 : -1)

      // trier les dates récupéré dans la page avec la fonction qui trie bien
      const datesSorted = [...dates].sort(antiChrono)

      // on regarde si y'a une différence entre les dates de la pages ET les dates triées
      expect(dates).toEqual(datesSorted)
    })
  })

  describe("When I click on New Bill button", () => {
    test("Then the new bill creation function should be called", async () => {

      ////////////////////////////////////////////////////////////////////
      // création de la page (headless dom)
      document.body.innerHTML = BillsUI({ data: bills })

      // simulation de données dans le localStorage
      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      // simule un employé connecté
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Employee'
      }))

      // création de la fonction onNavigate
      const onNavigate = (path) => {
        document.body.innerHTML = ROUTES({path})
      }

      // mock store
      const store = jest.fn();

      // création de la classe qui gère la page
      const billsContainer = new Bills({
        document,
        onNavigate,
        store,
        localStorage: localStorageMock
      })
      ////////////////////////////////////////////////////////////////////
      
      //récupérer le bouton
      const buttonNewBill = screen.getByTestId('btn-new-bill')
      
      // mock une fonction qui va être appelé quand on click sur le bouton
      const handleClickNewBill = jest.fn(() => {
        billsContainer.handleClickNewBill()
      })

      // on ajoute le listener de la fonction
      buttonNewBill.addEventListener('click', handleClickNewBill)

      // on click sur le bouton
      fireEvent.click(buttonNewBill)

      // tadaaaaa 🎉
      expect(handleClickNewBill).toHaveBeenCalled()
    })
  })

  describe("When I click on the eye icon", () => {
    test("Then the bill modal should open", async () => {
      
      ////////////////////////////////////////////////////////////////////
      // création de la page (headless dom)
      document.body.innerHTML = BillsUI({ data: bills })

      // mock store
      const store = jest.fn();

      // création de la classe qui gère la page
      const billsContainer = new Bills({
        document,
        onNavigate,
        store,
        localStorage: localStorageMock
      })
      ////////////////////////////////////////////////////////////////////

      const iconEye=document.querySelectorAll('#icon-eye')
      iconEye.forEach((icon) => {
        const handleClickIconEye = jest.fn((e)=>billsContainer.handleClickIconEye(icon))
        userEvent.click(icon)
        expect(handleClickIconEye).toHaveBeenCalled()
      })
    })
  })
})


// test d'intégration GET
describe("Given I am a user connected as an employee", () => {
  describe("When I navigate to Bills page", () => {
    test("fetches bills from mock API GET", async () => {
      ////////////////////////////////////////////////////////////////////
      // création de la page (headless dom)
      document.body.innerHTML = BillsUI({ data: bills })

      // simulation de données dans le localStorage
      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      // simule un employé connecté
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Employee'
      }))

      // création de la fonction onNavigate
      const onNavigate = (path) => {
        document.body.innerHTML = ROUTES({path})
      }

      // mock store
      const store = jest.fn();

      // création de la classe qui gère la page
      const billsContainer = new Bills({
        document,
        onNavigate,
        store,
        localStorage: localStorageMock
      })
      ////////////////////////////////////////////////////////////////////
      
     const contentTable  = await waitFor(() => screen.getByTestId("tbody"))
     expect(contentTable).toBeTruthy()

     const billType = await screen.queryByText('Transports')
     expect(billType).toBeTruthy()

    })

















  describe("When an error occurs on API", () => {
    beforeEach(() => {
      jest.spyOn(localStorageMock, "bills")
      Object.defineProperty(
          window,
          'localStorage',
          { value: localStorageMock }
      )
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Employee'
      }))

      const root = document.createElement("div")
      root.setAttribute("id", "root")
      document.body.appendChild(root)
      router()
    })
    test("fetches bills from an API and fails with 404 message error", async () => {

      localStorageMock.bills.mockImplementationOnce(() => {
        return {
          list : () =>  {
            return Promise.reject(new Error("Erreur 404"))
          }
        }})
      window.onNavigate(ROUTES_PATH.Bills)
      await new Promise(process.nextTick);
      const message = await screen.getByText(/Erreur 404/)
      expect(message).toBeTruthy()
    })

    test("fetches messages from an API and fails with 500 message error", async () => {

      localStorageMock.bills.mockImplementationOnce(() => {
        return {
          list : () =>  {
            return Promise.reject(new Error("Erreur 500"))
          }
        }})

      window.onNavigate(ROUTES_PATH.Bills)
      await new Promise(process.nextTick);
      const message = await screen.getByText(/Erreur 500/)
      expect(message).toBeTruthy()
    })
  })
  })
})