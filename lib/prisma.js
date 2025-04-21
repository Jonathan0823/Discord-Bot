const { PrismaClient } = require("@prisma/client");

/** @type {import('@prisma/client').PrismaClient} */
const prisma = new PrismaClient();

module.exports = {
  prisma,
};
