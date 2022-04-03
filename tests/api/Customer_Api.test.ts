import { test, expect, APIResponse } from "@playwright/test"

let response: APIResponse
let jsonResponse: any
let token: string
let first_customer_id: number
let first_customer_name: string
let first_customer:object
let newCustomerId:number

const getRandomNumber = (min:number, max:number) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };
  const result = Math.random().toString(36).substring(2,8);


test(`@API Verify Login to the application`, async ({ request }) => {
    response = await request.post(`/customer/api/v1/login`, {
        data: {
            username: "salman",
            password: "salman1234"
        }
    })
    jsonResponse = await response.json()
    token = jsonResponse.token

    expect(response.status()).toBe(200)
    expect(response.ok()).toBeTruthy()

})

test(`@API Verify Customer list`, async ({ request }) => {
    response = await request.get(`/customer/api/v1/list`,{
        headers: {
            'Authorization': `${token}`
        }
    })
    jsonResponse = await response.json()
    let listOfCustomer = await jsonResponse.Customers
    first_customer = await listOfCustomer[0]
    first_customer_id = await listOfCustomer[0].id
    first_customer_name = await listOfCustomer[0].name

    expect(first_customer_id).toBe(101)
    expect(response.status()).toBe(200)
    expect(response.ok()).toBeTruthy()

})

test(`@API Verify a Customer info`, async ({ request }) => {
    response = await request.get(`/customer/api/v1/get/${first_customer_id}`,{
        headers: {
            'Authorization': `${token}`
        }
    })
    jsonResponse = await response.json()
    
    expect(first_customer_name).toContain(jsonResponse.name)
    expect(response.status()).toBe(200)
    expect(response.ok()).toBeTruthy()

})

test(`@API Create a new Customer`, async ({ request }) => {

    newCustomerId =  getRandomNumber(1000,9999)
    const email = result+"@gmail.com"
    const phone = getRandomNumber(10000000000000,999999999999)

    response = await request.post(`/customer/api/v1/create`,{
        headers: {
            'Authorization': `${token}`
        },
        data:{
            id:newCustomerId,
            name:result,
            email:email,
            address:"Dhaka",
            phone_number:phone
        }
    })
    jsonResponse = await response.json()
    
    expect(jsonResponse.Customers.id).toBe(newCustomerId)
    expect(response.status()).toBe(201)
    expect(response.ok()).toBeTruthy()

})

test(`@API Create an existing Customer`, async ({ request }) => {
    response = await request.post(`/customer/api/v1/create`,{
        headers: {
            'Authorization': `${token}`
        },
        data:first_customer
    })
    jsonResponse = await response.json()
    
    expect(jsonResponse.error.message).toContain("Customer already exists")
    expect(response.status()).toBe(208)
    expect(response.ok()).toBeTruthy()

})

test(`@API Update newly Created Customer`, async ({ request }) => {
    response = await request.put(`/customer/api/v1/update/${newCustomerId}`,{
        headers: {
            'Authorization': `${token}`
        },
        data:{
            id:newCustomerId,
            name:"Dummy name",
            email:"dummy@gmail.com",
            address:"dummy",
            phone_number:"876347346"
        }
    })
    jsonResponse = await response.json()
    
    expect(jsonResponse.message).toContain("Success")
    expect(response.status()).toBe(200)
    expect(response.ok()).toBeTruthy()

})

test(`@API Generate Token Again`, async ({ request }) => {
    response = await request.post(`/customer/api/v1/login`, {
        data: {
            username: "salman",
            password: "salman1234"
        }
    })
    jsonResponse = await response.json()
    token = jsonResponse.token
})


test(`@API Delete a Customer`, async ({ request }) => {
    response = await request.delete(`/customer/api/v1/delete/${newCustomerId}`,{
        headers: {
            'Authorization': `${token}`
        }
    })
    jsonResponse = await response.json()
    
    expect(jsonResponse.message).toContain("Customer deleted!")
    expect(response.status()).toBe(200)
    expect(response.ok()).toBeTruthy()

})

test(`@API Delete existing Customer`, async ({ request }) => {
    response = await request.delete(`/customer/api/v1/delete/${newCustomerId}`,{
        headers: {
            'Authorization': `${token}`
        }
    })
    jsonResponse = await response.json()
    
    expect(jsonResponse.error.message).toContain("Customer not found")
    expect(response.status()).toBe(404)

})