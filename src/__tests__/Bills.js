/**
 * @jest-environment jsdom
 */

import {screen, waitFor} from "@testing-library/dom"
import BillsUI from "../views/BillsUI.js"
import { bills } from "../fixtures/bills.js"
import { ROUTES_PATH} from "../constants/routes.js";
import {localStorageMock} from "../__mocks__/localStorage.js";

import router from "../app/Router.js";

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
})
