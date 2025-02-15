const { PrismaClient } = require('@prisma/client');
const fs = require('fs');

async function seedDatabase() {
  const prisma = new PrismaClient();

  try {
    const rawData = fs.readFileSync('course-data.json', 'utf-8');
    const jsonData = JSON.parse(rawData);

    const transformedData = jsonData.map((item) => ({
      name: item.name,
      lat: item.lat,
      lng: item.lng,
      address: item.address,
    }));

    await prisma.course.createMany({
      data: transformedData,
      skipDuplicates: true,
    });

    console.log('Data inserted successfully!');
  } catch (error) {
    console.error('Error inserting data:', error);
  } finally {
    await prisma.$disconnect();
  }
}

seedDatabase();
