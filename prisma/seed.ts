import { PrismaClient } from '@/app/generated/prisma'
import { PrismaPg } from '@prisma/adapter-pg'
import bcrypt from 'bcryptjs'
import * as dotenv from 'dotenv'

dotenv.config()

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! })
const prisma = new PrismaClient({ adapter })

async function main() {
  console.log('🌱 Starting database seed...')

  // Clear existing data
  await prisma.loan.deleteMany()
  await prisma.bookAuthor.deleteMany()
  await prisma.book.deleteMany()
  await prisma.author.deleteMany()
  await prisma.user.deleteMany()
  await prisma.contact.deleteMany()

  console.log('✅ Cleared existing data')

  // Create users
  const hashedPassword = await bcrypt.hash('password123', 10)

  const student = await prisma.user.create({
    data: {
      name: 'Ahmed El Mansouri',
      email: 'student@example.com',
      password: hashedPassword,
      role: 'STUDENT',
      phone: '+212 6 12 34 56 78',
      address: 'Rabat, Morocco',
    },
  })

  const professor = await prisma.user.create({
    data: {
      name: 'Dr. Fatima Alaoui',
      email: 'professor@example.com',
      password: hashedPassword,
      role: 'PROFESSOR',
      phone: '+212 6 23 45 67 89',
      address: 'Casablanca, Morocco',
    },
  })

  const librarian = await prisma.user.create({
    data: {
      name: 'Zakaria Benali',
      email: 'librarian@example.com',
      password: hashedPassword,
      role: 'LIBRARIAN',
      phone: '+212 6 34 56 78 90',
      address: 'Rabat, Morocco',
    },
  })

  const admin = await prisma.user.create({
    data: {
      name: 'Admin User',
      email: 'admin@example.com',
      password: hashedPassword,
      role: 'ADMIN',
      phone: '+212 6 45 67 89 01',
      address: 'Rabat, Morocco',
    },
  })

  console.log('✅ Created users')

  // Create authors
  const authors = await Promise.all([
    prisma.author.create({
      data: {
        name: 'Robert C. Martin',
        bio: 'Also known as Uncle Bob, is a software engineer and author, best known for being one of the authors of the Agile Manifesto and for developing several software design principles.',
        photoUrl: 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=400',
      },
    }),
    prisma.author.create({
      data: {
        name: 'Martin Fowler',
        bio: 'British software developer, author and international public speaker on software development, specializing in object-oriented analysis and design, UML, patterns, and agile software development methodologies.',
        photoUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400',
      },
    }),
    prisma.author.create({
      data: {
        name: 'Eric Evans',
        bio: 'Software developer and author who pioneered Domain-Driven Design (DDD), a software development approach focused on modeling software to match a domain according to input from domain experts.',
        photoUrl: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400',
      },
    }),
    prisma.author.create({
      data: {
        name: 'Kent Beck',
        bio: 'American software engineer and the creator of Extreme Programming and Test-Driven Development. He is one of the 17 original signatories of the Agile Manifesto.',
        photoUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400',
      },
    }),
    prisma.author.create({
      data: {
        name: 'Gang of Four',
        bio: 'Erich Gamma, Richard Helm, Ralph Johnson, and John Vlissides - authors of the influential software engineering book "Design Patterns: Elements of Reusable Object-Oriented Software".',
        photoUrl: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=400',
      },
    }),
    prisma.author.create({
      data: {
        name: 'Joshua Bloch',
        bio: 'American software engineer and author, known for his work on the Java platform and for writing the influential book "Effective Java".',
        photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
      },
    }),
  ])

  console.log('✅ Created authors')

  // Create books with authors
  const books = [
    {
      title: 'Clean Code: A Handbook of Agile Software Craftsmanship',
      isbn: '9780132350884',
      publisher: 'Prentice Hall',
      publishedYear: 2008,
      category: 'Software Engineering',
      description: 'Even bad code can function. But if code isn t clean, it can bring a development organization to its knees. Every year, countless hours and significant resources are lost because of poorly written code.',
      coverUrl: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=400',
      totalCopies: 3,
      availableCopies: 3,
      authorNames: ['Robert C. Martin'],
    },
    {
      title: 'Refactoring: Improving the Design of Existing Code',
      isbn: '9780134757599',
      publisher: 'Addison-Wesley',
      publishedYear: 2018,
      category: 'Software Engineering',
      description: 'Refactoring is the process of changing a software system in a way that does not alter the external behavior of the code yet improves its internal structure.',
      coverUrl: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400',
      totalCopies: 2,
      availableCopies: 2,
      authorNames: ['Martin Fowler'],
    },
    {
      title: 'Domain-Driven Design: Tackling Complexity in the Heart of Software',
      isbn: '9780321125217',
      publisher: 'Addison-Wesley',
      publishedYear: 2003,
      category: 'Software Architecture',
      description: 'Domain-Driven Design fills that need. This is not a book about specific technologies. It offers readers a systematic approach to domain-driven design, presenting an extensive set of design best practices, experience-based techniques, and fundamental principles.',
      coverUrl: 'https://images.unsplash.com/photo-1589998059171-988d887df646?w=400',
      totalCopies: 2,
      availableCopies: 1,
      authorNames: ['Eric Evans'],
    },
    {
      title: 'Test-Driven Development: By Example',
      isbn: '9780321146530',
      publisher: 'Addison-Wesley',
      publishedYear: 2002,
      category: 'Software Testing',
      description: 'Follows two TDD projects from start to finish, illustrating techniques programmers can use to increase the quality of their work.',
      coverUrl: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=400',
      totalCopies: 2,
      availableCopies: 2,
      authorNames: ['Kent Beck'],
    },
    {
      title: 'Design Patterns: Elements of Reusable Object-Oriented Software',
      isbn: '9780201633610',
      publisher: 'Addison-Wesley',
      publishedYear: 1994,
      category: 'Software Design',
      description: 'Capturing a wealth of experience about the design of object-oriented software, four top-notch designers present a catalog of simple and succinct solutions to commonly occurring design problems.',
      coverUrl: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=400',
      totalCopies: 3,
      availableCopies: 3,
      authorNames: ['Gang of Four'],
    },
    {
      title: 'Effective Java',
      isbn: '9780134685991',
      publisher: 'Addison-Wesley',
      publishedYear: 2017,
      category: 'Programming Languages',
      description: 'The definitive guide to Java programming language best practices. Provides 90 rules for writing clear, robust, effective Java code.',
      coverUrl: 'https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?w=400',
      totalCopies: 2,
      availableCopies: 2,
      authorNames: ['Joshua Bloch'],
    },
    {
      title: 'Clean Architecture: A Craftsman\'s Guide to Software Structure',
      isbn: '9780134494166',
      publisher: 'Prentice Hall',
      publishedYear: 2017,
      category: 'Software Architecture',
      description: 'Building upon the success of best-sellers The Clean Coder and Clean Code, legendary software craftsman Robert C. Martin shows how to bring greater professionalism and discipline to application architecture.',
      coverUrl: 'https://images.unsplash.com/photo-1519682337058-a94d519337bc?w=400',
      totalCopies: 2,
      availableCopies: 0,
      authorNames: ['Robert C. Martin'],
    },
    {
      title: 'Patterns of Enterprise Application Architecture',
      isbn: '9780321127426',
      publisher: 'Addison-Wesley',
      publishedYear: 2002,
      category: 'Software Architecture',
      description: 'The practice of enterprise application development has benefited from the emergence of many new enabling technologies. Multi-tiered object-oriented platforms provide the basic enabling technologies.',
      coverUrl: 'https://images.unsplash.com/photo-1516979187457-637abb4f9353?w=400',
      totalCopies: 1,
      availableCopies: 1,
      authorNames: ['Martin Fowler'],
    },
  ]

  for (const bookData of books) {
    const { authorNames, ...bookInfo } = bookData
    
    const book = await prisma.book.create({
      data: bookInfo,
    })

    // Link authors to book
    for (let i = 0; i < authorNames.length; i++) {
      const authorName = authorNames[i]
      const author = authors.find( (a:any) => a.name === authorName)
      
      if (author) {
        await prisma.bookAuthor.create({
          data: {
            bookId: book.id,
            authorId: author.id,
            order: i + 1,
          },
        })
      }
    }
  }

  console.log('✅ Created books with author relationships')

  // Create sample contact messages
  await prisma.contact.create({
    data: {
      name: 'Sara Idrissi',
      email: 'sara@example.com',
      message: 'I would like to know if you have any books on Machine Learning available?',
      read: false,
    },
  })

  await prisma.contact.create({
    data: {
      name: 'Youssef Bennani',
      email: 'youssef@example.com',
      message: 'When will the library be open during the holidays?',
      read: true,
    },
  })

  console.log('✅ Created sample contact messages')

  // Create sample loan requests
  const domainDrivenBook = await prisma.book.findFirst({
    where: { title: { contains: 'Domain-Driven' } },
  })

  const cleanArchBook = await prisma.book.findFirst({
    where: { title: { contains: 'Clean Architecture' } },
  })

  if (domainDrivenBook) {
    await prisma.loan.create({
      data: {
        bookId: domainDrivenBook.id,
        userId: student.id,
        status: 'PENDING',
        notes: 'Need this for my software architecture course project.',
      },
    })
  }

  if (cleanArchBook) {
    // This book has 0 available copies (all loaned out)
    await prisma.loan.create({
      data: {
        bookId: cleanArchBook.id,
        userId: professor.id,
        status: 'APPROVED',
        approvedBy: librarian.id,
        approvedAt: new Date(),
        loanDate: new Date(),
        dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days from now
      },
    })
  }

  console.log('✅ Created sample loan requests')

  console.log('\n🎉 Database seeded successfully!')
  console.log('\n📧 Demo Accounts:')
  console.log('   Student:   student@example.com / password123')
  console.log('   Professor: professor@example.com / password123')
  console.log('   Librarian: librarian@example.com / password123')
  console.log('   Admin:     admin@example.com / password123')
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })