import React from 'react';
import './index.scss';

import { createRoot } from 'react-dom/client'

interface IModalProps {
    children: any,
    onDismiss: () => void
}

const CIModal: React.FunctionComponent<IModalProps> = (props) => {
    React.useEffect(() => {
        document.body.style.position = 'fixed';
        document.body.style.overflow = 'hidden';
        document.body.style.width = '100%';
        return () => {
            document.body.style.position = 'relative';
            document.body.style.overflow = 'auto';
            document.body.style.width = 'auto';
        };
    }, []);

    const onClickMask = () => {
        props.onDismiss && props.onDismiss();
    };

    // let ciModal = document.createElement("div");
    // ciModal.className = 'cis-modal'
    
    // document.body.appendChild(ciModal)
    // createRoot(ciModal).render(
    //     <>
    //     <div className="cis-modal-mask" onClick={onClickMask}></div>
    //     <div className="cis-modal-content">
    //         {props.children}
    //     </div>
    //     </>
    // )
    // return <></>
    return (
        <div className="cis-modal">
            <div className="cis-modal-mask" onClick={onClickMask}></div>
            <div className="cis-modal-content">
                {props.children}
            </div>
        </div>
    );
};

export default CIModal;
