import { LightningElement, api } from 'lwc';
import type { SsrDataResponse, SsrRequestContext } from '@lwrjs/types';

interface Book {
    id: string;
    volumeInfo: {
        title: string;
        href: string;
        description?: string;
        imageLinks?: { [key: string]: string };
    };
}

export default class ExampleBookList extends LightningElement {
    static renderMode = 'light';
    authorList = [
        { name: 'Beverly Cleary', slug: 'beverly+cleary' },
        { name: 'Judy Blume', slug: 'judy+blume' },
        { name: 'Eleanor Estes', slug: 'eleanor+estes' },
        { name: 'Roald Dahl', slug: 'roald+dahl' },
    ];
    @api data?: { items: Book[] };
    @api author = this.authorList[0].slug;

    get authors(): { name: string; active: boolean; href: string }[] {
        return this.authorList.map(({ name, slug }) => {
            const active = slug === this.author;
            return { name, active, href: `/books/${slug}` };
        });
    }

    get books(): Book[] {
        const books = this.data?.items || [];
        return books.map((book) => ({ ...book, href: `/books/${this.author}/${book.id}` }));
    }
}

export async function getServerData(context: SsrRequestContext): Promise<SsrDataResponse> {
    // This is called to fetch data when the component is SSRed
    const author = context.params.author;
    const response = await fetch(
        `https://www.googleapis.com/books/v1/volumes?q=inauthor:${author}&langRestrict=${context.locale}&maxResults=10`,
    );
    const data = await response.json();
    // The "props" get passed to the ExampleBookList component as public properties during SSR and client hydration
    return { props: { data, ...context.params } };
}
