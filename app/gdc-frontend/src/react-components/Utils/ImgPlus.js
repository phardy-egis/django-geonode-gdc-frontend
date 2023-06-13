// RESULTS - RESULT LIST ITEMS
export default class ImgPlus extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            status: 'loading',
        };
        this.handleOnLoad = this.handleOnLoad.bind(this);
    }

    handleOnLoad() {
        this.setState({ status: 'ready' })
    }

    render() {
        var spinnerDom = []

        var altText = ''
        if (this.props.alt != '') {
            var altText = this.props.alt
        }
        else {
            altText = 'Image'
        }

        if (this.state.status == 'loading') {
            spinnerDom.push(
                <p key={this.props.src} className="uk-padding-small uk-margin-remove uk-text-small"><span data-uk-spinner="ratio: 0.8"></span> &nbsp; {altText} loading...</p>
            )
        }
        else { spinnerDom = [] }

        var domRes = (
            <div className="uk-width-1-1 uk-height-1-1">
                <img src={this.props.src} onLoad={this.handleOnLoad} />
                {spinnerDom}
            </div>
        )

        return domRes
    }

}