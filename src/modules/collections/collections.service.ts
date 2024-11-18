

// import { Injectable } from '@nestjs/common';
// import { PrismaService } from 'src/prisma/prisma.service';
// import { ProductResponseDto } from './dto/product-response.dto';
// import { CollectionResponseDto } from './dto/collection-response.dto';
// import { plainToClass } from 'class-transformer';

// @Injectable()
// export class CollectionsService {
//   constructor(private readonly prisma: PrismaService) { }

//   // Fetch all products in collections, ordered by uploadDate (Product)
//   async getNewCollections(): Promise<ProductResponseDto[]> {
//     const products = await this.prisma.product.findMany({
//       orderBy: {
//         uploadDate: 'desc', // Sort by uploadDate (Product's created timestamp)
//       },
//       include: {
//         collectionProducts: { // Join table linking products and collections
//           include: {
//             collection: true, // Explicitly include the collection object
//           },
//         },
//         images: true, // Include the images relation for each product
//       },
//     });

//     // Base URL for images (update with your actual domain or server path)
//     const baseUrl = 'http://your-domain.com/uploads/'; // Make sure to update this URL

//     // Map each product to ProductResponseDto before returning
//     return products.map((product) =>
//       plainToClass(ProductResponseDto, {
//         id: product.id,
//         name: product.name,
//         description: product.description,
//         price: product.price,
//         createdAt: product.uploadDate.toISOString(), // Ensure it's a string
//         // imageUrl: product.images?.[0]?.path ? `${baseUrl}${product.images[0].path.replace(/\\/g, '/')}` : '', // Format image URL
//         // In your service, modify this line to ensure the image URL is correct.
//         imageUrl: product.images?.[0]?.path ? `${baseUrl}${product.images[0].path.replace(/\\/g, '/')}` : '',

//         collections: product.collectionProducts.map((cp) => ({
//           id: cp.collection.id, // Correct access to the collection relation
//           name: cp.collection.name,
//           description: cp.collection.description,
//         })),
//       })
//     );
//   }

//   // Fetch collections with products, sorted by the createdAt field of CollectionProduct
//   async getCollectionsWithProducts(): Promise<CollectionResponseDto[]> {
//     const collections = await this.prisma.collection.findMany({
//       orderBy: {
//         id: 'desc', // Sorting collections by ID (or another relevant field)
//       },
//       include: {
//         collectionProducts: { // Join table between products and collections
//           include: {
//             product: {
//               include: {
//                 images: true, // Include images for products
//               },
//             },
//           },
//         },
//       },
//     });

//     // Base URL for images (update with your actual domain or server path)
//     const baseUrl = 'http://your-domain.com/uploads/'; // Make sure to update this URL

//     // Map each collection to CollectionResponseDto
//     return collections.map((collection) =>
//       plainToClass(CollectionResponseDto, {
//         id: collection.id,
//         name: collection.name,
//         description: collection.description,
//         createdAt: collection.collectionProducts[0]?.createdAt.toISOString(), // Use createdAt of the first product in the collection
//         products: collection.collectionProducts.map((collectionProduct) => ({
//           id: collectionProduct.product.id,
//           name: collectionProduct.product.name,
//           description: collectionProduct.product.description,
//           price: collectionProduct.product.price,
//           createdAt: collectionProduct.product.uploadDate.toISOString(), // Product creation date
//           imageUrl: collectionProduct.product.images?.[0]?.path
//             ? `${baseUrl}${collectionProduct.product.images[0].path.replace(/\\/g, '/')}` // Format image URL
//             : '', // Handle image URL (fallback to empty string if no image)
//         })),
//       })
//     );
//   }
// }

import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { ProductResponseDto } from './dto/product-response.dto';
import { CollectionResponseDto } from './dto/collection-response.dto';
import { plainToClass } from 'class-transformer';

@Injectable()
export class CollectionsService {
  constructor(private readonly prisma: PrismaService) { }

  // Fetch all products in collections, ordered by uploadDate (Product)
  async getNewCollections(): Promise<ProductResponseDto[]> {
    const products = await this.prisma.product.findMany({
      orderBy: {
        uploadDate: 'desc', // Sort by uploadDate (Product's created timestamp)
      },
      include: {
        collectionProducts: { // Join table linking products and collections
          include: {
            collection: true, // Explicitly include the collection object
          },
        },
        images: true, // Include the images relation for each product
      },
    });

    // Base URL for images (update with your actual domain or server path)
    const baseUrl = 'http://localhost:5000/uploads/'; // Make sure to update this URL

    // Map each product to ProductResponseDto before returning
    return products.map((product) =>
      plainToClass(ProductResponseDto, {
        id: product.id,
        name: product.name,
        description: product.description,
        price: product.price,
        createdAt: product.uploadDate.toISOString(), // Ensure it's a string
        // Fix image URL: Remove the extra /uploads/ if it's already part of the image path
        imageUrl: product.images?.[0]?.path
          ? `${baseUrl}${this.normalizeImagePath(product.images[0].path)}`
          : '',

        collections: product.collectionProducts.map((cp) => ({
          id: cp.collection.id, // Correct access to the collection relation
          name: cp.collection.name,
          description: cp.collection.description,
        })),
      })
    );
  }

  // Fetch collections with products, sorted by the createdAt field of CollectionProduct
  async getCollectionsWithProducts(): Promise<CollectionResponseDto[]> {
    const collections = await this.prisma.collection.findMany({
      orderBy: {
        id: 'desc', // Sorting collections by ID (or another relevant field)
      },
      include: {
        collectionProducts: { // Join table between products and collections
          include: {
            product: {
              include: {
                images: true, // Include images for products
              },
            },
          },
        },
      },
    });

    // Base URL for images (update with your actual domain or server path)
    const baseUrl = 'http://localhost:5000/uploads/'; // Make sure to update this URL

    // Map each collection to CollectionResponseDto
    return collections.map((collection) =>
      plainToClass(CollectionResponseDto, {
        id: collection.id,
        name: collection.name,
        description: collection.description,
        createdAt: collection.collectionProducts[0]?.createdAt.toISOString(), // Use createdAt of the first product in the collection
        products: collection.collectionProducts.map((collectionProduct) => ({
          id: collectionProduct.product.id,
          name: collectionProduct.product.name,
          description: collectionProduct.product.description,
          price: collectionProduct.product.price,
          createdAt: collectionProduct.product.uploadDate.toISOString(), // Product creation date
          // Fix image URL for products inside collections
          imageUrl: collectionProduct.product.images?.[0]?.path
            ? `${baseUrl}${this.normalizeImagePath(collectionProduct.product.images[0].path)}`
            : '', // Handle image URL (fallback to empty string if no image)
        })),
      })
    );
  }

  // Helper function to normalize the image path
  private normalizeImagePath(imagePath: string): string {
    // Normalize path: replace backslashes with forward slashes and remove the leading /uploads/ if it exists
    return imagePath.replace(/\\/g, '/').replace(/^uploads\//, '');
  }
}


