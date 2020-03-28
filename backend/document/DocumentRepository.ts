import { Document } from './Document'
import { DatabaseService } from '../persistance/DatabaseService';

export class DocumentRepository {
    private collectionName = 'groups';

    constructor(private databaseConnection: DatabaseService) { }

    async getDocumentById(documentRefId: string): Promise<Document | null> {
        const result = await this.databaseConnection.getCollectionEntries(this.collectionName, { documentRefId });
        if (result.length >= 1) {
            return result[0];
        }
        return null;
    }

    async getAllDocuments(): Promise<Document[] | null> {
        const result = await this.databaseConnection.getAllCollectionEntries(this.collectionName);
        if (result.length >= 1) {
            return result;
        }
        return null;
    }

    async getAllDocumentsByGroup(group: string): Promise<Document[] | null> {
        const query = { groups: [group] };
        const result = await this.databaseConnection.getCollectionEntries(this.collectionName, query);
        if (result.length >= 1) {
            return result[0];
        }
        return null;
    }


    async addDocument(document: Document): Promise<Document> {
        return this.databaseConnection.addObject(this.collectionName, document);
    }

    async checkDocumentWithIdExists(documentRefId: string): Promise<boolean> {
        const result = await this.databaseConnection.getCollectionEntries(this.collectionName, { documentRefId });
        return result.length >= 1;
    }

    async deleteDocument(documentRefId: string) {
        await this.databaseConnection.deleteCollectionEntry(this.collectionName, { documentRefId });
    }

    async updateDocument(document: Document) {
        await this.databaseConnection.updateCollectionEntry(
            this.collectionName,
            { documentRefId: document.documentRefId },
            document
        );
    }
}
