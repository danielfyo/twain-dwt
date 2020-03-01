import React, { PureComponent } from 'react';

import {
    DocumentCard,
    DocumentCardActivity,
    DocumentCardPreview,
    DocumentCardTitle,
    IDocumentCardPreviewProps
} from 'office-ui-fabric-react/lib/DocumentCard';

import { ImageFit } from 'office-ui-fabric-react/lib/Image';

import './PagePreview.css';
import { SheetDto } from '../../model/Sheet';

export class PagePreview extends PureComponent<any, any> {
    constructor(props: any) {
        super(props);
        this.state = {
            sheets: [],
        }
    }

    addImageToPreview(base64Image: string) {
        let newSheet = new SheetDto();
        newSheet.sheetBase64 = base64Image;
        let oldArray = this.state.sheets;
        oldArray.push(newSheet);
        this.setState({
            sheets: oldArray,
        });
    }

    public render(): JSX.Element {
        console.log(this.state.sheets);
        return (
            <div className="PagePreviewMain">
                <div className="previwPanel">
                    <div className='ms-Grid-row'>
                        <div className='ms-Grid-col' id="listPreview">
                            {
                                this.state.sheets.map((sheet: any, i: React.ReactNode) => {
                                    console.log("Entered");
                                    return (
                                    <DocumentCard
                                        aria-label="Vista previa"
                                        onClickHref="http://bing.com">

                                        <DocumentCardPreview
                                            {...
                                            {
                                                previewImages: [
                                                    {
                                                        name: 'Página 1',
                                                        url: 'http://bing.com',
                                                        previewImageSrc: sheet,
                                                        iconSrc: 'Preview',
                                                        imageFit: ImageFit.cover,
                                                        width: 132,
                                                        height: 150,
                                                    }
                                                ]
                                            }
                                            } />

                                        <DocumentCardTitle
                                            title=""
                                            shouldTruncate={true} />
                                        <div className="RecognizedData">

                                            <span className="ms-DocumentCardActivityPage"># {i}</span>
                                            <DocumentCardActivity
                                                activity=""
                                                people={[{
                                                    name: '',
                                                    profileImageSrc: ''
                                                }]} />

                                            <DocumentCardActivity
                                                activity=""
                                                people={[{
                                                    name: '',
                                                    profileImageSrc: ''
                                                }]} />
                                        </div>
                                    </DocumentCard>
                                    )
                                })
                            }
                        </div>
                    </div>
                </div>
            </div>
        )
    }

}
export default PagePreview;