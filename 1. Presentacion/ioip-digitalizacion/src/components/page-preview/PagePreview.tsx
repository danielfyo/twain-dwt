import React, { PureComponent } from 'react';

import {
    DocumentCard,
    DocumentCardActivity,
    DocumentCardPreview,
    DocumentCardTitle
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

    addImageToPreview(base64Image: string, index: number) {
        let newSheet = new SheetDto();
        newSheet.sheetBase64 = base64Image;
        newSheet.sheetId = index;
        let oldArray = this.state.sheets;
        oldArray.push(newSheet);
        this.setState({
            sheets: oldArray,
        });
        this.forceUpdate();
    }

    public render(): JSX.Element {
        return (
            <div className="PagePreviewMain">
                <div className="previwPanel">
                    <div className='ms-Grid-row'>
                        <div className='ms-Grid-col' id="listPreview">
                            {
                                this.state.sheets.map((sheet: SheetDto, i: React.ReactNode) => {
                                    return (
                                    <DocumentCard
                                        aria-label="Vista previa"
                                        onClick={()=>{
                                            let win = window.open();
                                            win.document.write('<iframe src="' + sheet.sheetBase64  + '" frameborder="0" style="border:0; top:0px; left:0px; bottom:0px; right:0px; width:100%; height:100%;" allowfullscreen></iframe>');
                                        }}
                                        
                                        key={sheet.sheetId.toString()}>

                                        <DocumentCardPreview
                                            {...
                                            {
                                                previewImages: [
                                                    {
                                                        name: 'Página ',
                                                        url: 'http://bing.com',
                                                        previewImageSrc: sheet.sheetBase64,
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

                                            <span className="ms-DocumentCardActivityPage">Pág {sheet.sheetId.toString()}</span>
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