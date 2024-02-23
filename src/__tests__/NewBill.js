/**
 * @jest-environment jsdom
 */

import { screen, waitFor } from "@testing-library/dom"
import NewBillUI from "../views/NewBillUI.js"
import NewBill from "../containers/NewBill.js"


describe("Given I am connected as an employee", () => {
  describe("When I am on NewBill Page", () => {
    test("Then new bill form should appear", async () => {
      const html = NewBillUI()
      document.body.innerHTML = html
      //to-do write assertion
      await waitFor(() => screen.queryByText('Envoyer une note de frais'))//form-new-bill
      const newBillForm = screen.queryByText('Envoyer une note de frais')
      
      expect(newBillForm).toBeTruthy()
    })
  })
})
