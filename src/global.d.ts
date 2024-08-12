// src/global.d.ts

declare namespace google {
    export namespace picker {
        enum Action {
            PICKED = 'picked',
            CANCEL = 'cancel'
        }
        interface Document {
            id: string;
            name: string;
            mimeType: string;
            url: string;
        }
        interface Response {
            ACTION: string;
            DOCUMENTS: Document[];
        }
        class PickerBuilder {
            addView(view: ViewId): PickerBuilder;
            setOAuthToken(token: string): PickerBuilder;
            setDeveloperKey(key: string): PickerBuilder;
            setCallback(callback: (data: Response) => void): PickerBuilder;
            build(): Picker;
            setDocument(document: Document): PickerBuilder;
        }
        interface Picker {
            setVisible(visible: boolean): void;
        }
        enum ViewId {
            DOCS = 'docs'
        }
    }
}