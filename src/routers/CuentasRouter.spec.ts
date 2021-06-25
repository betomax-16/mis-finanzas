import server from '../app';
import request from "supertest";
import mongoose from 'mongoose';

import Divisa,{ IDivisa } from '../models/Divisas/Divisa';
import Cuenta, { ICuenta } from '../models/Cuentas/Cuenta';
import CuentaBancaria, { ICuentaBancaria } from '../models/Cuentas/CuentaBancaria';
import CuentaPersonal, { ICuentaPersonal } from '../models/Cuentas/CuentaPersonal';

const cuentas = [
  {
    nombre: "test",
    tipo: "personal",
    estado: true,
  },
  {
    nombre: "test",
    noCuenta: 12345,
    banco: "bnx",
    tipo: "bancaria",
    estado: true,
  }
];

let idCreated: string;

describe("/api/cuentas -> Gestion de cuentas", () => {
  beforeAll(async () => {
    await Divisa.deleteMany({});
    await CuentaBancaria.deleteMany({});
    await CuentaPersonal.deleteMany({});
    await Cuenta.deleteMany({});

    // Connect to a Mongo DB
    const cuenta1: ICuenta = new Cuenta(cuentas[1]);
    await cuenta1.save();
    const divisa: IDivisa = new Divisa({ cuenta: cuenta1._id });
    await divisa.save();

    const cuentaB: ICuentaBancaria = new CuentaBancaria({
      ...cuentas[1],
      cuenta: cuenta1._id
    });
    await cuentaB.save();
    idCreated = cuenta1._id;
    


    const cuenta2: ICuenta = new Cuenta(cuentas[0]);
    await cuenta2.save();
    const divisa2: IDivisa = new Divisa({ cuenta: cuenta2._id });
    await divisa2.save();

    const cuentaP: ICuentaPersonal = new CuentaPersonal({
      ...cuentas[0],
      cuenta: cuenta2._id
    });
    await cuentaP.save();

  });

  it("Obtener todas las cuentas del sistema", async () => {
    const result = await request(server.app).
    get("/api/cuentas").
    expect(200).
    expect('Content-Type', /application\/json/);

    expect(result.body).toHaveLength(cuentas.length)
  });

  it("Crear cuenta personal", async () => {
    const cuenta = { nombre: "nueva cuenta personal" };
    const result = await request(server.app).
    post("/api/cuentas").
    send(cuenta).
    expect(200).
    expect('Content-Type', /application\/json/);

    const id = result.body._id;
    const idDivisa = result.body.divisas[0]._id;
    expect(result.body).toEqual({
      "_id": id,
      "nombre": "nueva cuenta personal",
      "tipo": "personal",
      "divisas": [
        {
          "_id": idDivisa,
          "cuenta": id,
          "nombre": "Peso Mexicano",
          "codigo": "MXN",
          "monto": 0,
          "__v": 0
        }
      ]
    })
  });

  it("Crear cuenta bancaria", async () => {
    const cuenta = { 
      nombre: "nueva cuenta bancaria",
      noCuenta: 12345,
      banco: "bnx",
    };

    const result = await request(server.app).
    post("/api/cuentas").
    send(cuenta).
    expect(200).
    expect('Content-Type', /application\/json/);

    const id = result.body._id;
    const idDivisa = result.body.divisas[0]._id;
    expect(result.body).toEqual({
      "_id": id,
      "nombre": "nueva cuenta bancaria",
      "noCuenta": 12345,
      "banco": "bnx",
      "tipo": "bancaria",
      "divisas": [
        {
          "_id": idDivisa,
          "cuenta": id,
          "nombre": "Peso Mexicano",
          "codigo": "MXN",
          "monto": 0,
          "__v": 0
        }
      ]
    })
  });

  it("Obetener una cuenta", async () => {
    const result = await request(server.app).
    get(`/api/cuentas/${idCreated}`).
    expect(200).
    expect('Content-Type', /application\/json/);

    const id = result.body._id;
    const idDivisa = result.body.divisas[0]._id;
    expect(result.body).toEqual({
      "_id": id,
      "nombre": "test",
      "noCuenta": 12345,
      "banco": "bnx",
      "tipo": "bancaria",
      "divisas": [
        {
          "_id": idDivisa,
          "cuenta": id,
          "nombre": "Peso Mexicano",
          "codigo": "MXN",
          "monto": 0,
          "__v": 0
        }
      ]
    })
  });

  it("Actualizar cuenta bancaria", async () => {
    const cuenta = { 
      nombre: "cuenta bancaria editada",
      noCuenta: 123456,
      banco: "vital",
    };

    const result = await request(server.app).
    put(`/api/cuentas/${idCreated}`).
    send(cuenta).
    expect(200).
    expect('Content-Type', /application\/json/);

    const id = result.body._id;
    const idDivisa = result.body.divisas[0]._id;
    expect(result.body).toEqual({
      "_id": id,
      "nombre": "cuenta bancaria editada",
      "noCuenta": 123456,
      "banco": "vital",
      "tipo": "bancaria",
      "divisas": [
        {
          "_id": idDivisa,
          "cuenta": id,
          "nombre": "Peso Mexicano",
          "codigo": "MXN",
          "monto": 0,
          "__v": 0
        }
      ]
    })
  });

  afterEach(() => {
    
  });

  afterAll(() => {
    mongoose.connection.close();
    server.serverListener.close();
  });
});

