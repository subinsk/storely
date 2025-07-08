This is an ecommerce application's monorepo architecture designed for scalability and maintainability. The architecture includes separate applications for the admin dashboard and customer-facing web store, along with shared components, utilities, and a unified database schema.
Use powershell commands to run the scripts.
[]: # npm run dev:admin        # Start admin dashboard
[]: # npm run dev:web          # Start web store
[]: # 
[]: # # Build
[]: # npm run build            # Build both apps
[]: # npm run build:admin      # Build admin dashboard
[]: # npm run build:web        # Build web store
[]: # 
[]: # # Database
[]: # npm run db:generate      # Generate Prisma client
[]: # npm run db:migrate       # Run migrations
[]: # npm run db:seed          # Seed database
[]: # ```
[]: #
Always use the best practices for coding, for ui always use modern, modular, and responsive design principles. Ensure that the code is clean, well-structured, and follows the conventions of the technologies used.
Critically analyse each problem and also in depth.
If there is a file then the files imported there also need to be taken care of.
When implementing features, consider performance optimizations, accessibility standards, and user experience. Use TypeScript for type safety and to catch errors early in the development process.
When writing tests, ensure they cover both unit and integration scenarios. Use Jest and React Testing Library for testing React components, and Prisma's testing utilities for database interactions.
Fix the code without asking if i want to fix it or not, just fix it.
If you encounter any issues or bugs, debug them thoroughly and provide a solution that addresses the root cause of the problem.
When implementing new features, ensure they are modular and reusable. Use components for UI elements.
To keep modularity create best practices folders, files, etc.