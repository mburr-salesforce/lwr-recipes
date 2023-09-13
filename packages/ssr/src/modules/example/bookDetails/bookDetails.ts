import { LightningElement, api } from 'lwc';
import type { SsrDataResponse, SsrRequestContext } from '@lwrjs/types';

interface Book {
    volumeInfo: {
        title: string;
        description?: string;
        canonicalVolumeLink: string;
        authors: string[];
        categories: string[];
        pageCount: string;
        publishedDate: string;
        publisher: string;
        imageLinks?: { [key: string]: string };
    };
}

export default class ExampleBookDetails extends LightningElement {
    static renderMode = 'light';
    @api data?: Book;
    @api bookId?: string;
}

export async function getServerData(context: SsrRequestContext): Promise<SsrDataResponse> {
    // This is called to fetch data when the component is SSRed, including preloading the book image
    const bookId = context.params.bookId;
    const response = await fetch(`https://www.googleapis.com/books/v1/volumes/${bookId}`);
    const data = await response.json();
    return {
        // The "props" get passed to the ExampleBookDetails component as public properties during SSR and client hydration
        props: { data, ...context.params },
        markup: {
            links: [
                {
                    // Preload the book image via a link in the page's HTML document
                    href: data.volumeInfo.imageLinks.thumbnail,
                    as: 'image',
                    rel: 'preload',
                    fetchpriority: 'high',
                },
            ],
        },
    };
}
