
var React = require('react');
var ReactDOM = require('react-dom');
var Modal = require('react-bootstrap').Modal;
var Button = require('react-bootstrap').Button;
var FieldGroup = require('react-bootstrap').FieldGroup;
var Select = require('react-select');
import 'react-select/dist/react-select.css';



class PartsCatalogue extends React.Component
{
    constructor(props)
    {
        super(props);
        this.state = 
            {
                isAdmin : true,
                schemeList: window.schemeList,
                schemaParts : window.schemePartsList
            };
        this.handleOnExpand = this.handleOnExpand.bind(this);
        this.handleOnSelect = this.handleOnSelect.bind(this);
        this.onEditPart = this.onEditPart.bind(this);
    }

    onEditPart(newSchemePartsList)
    {
        // let list = this.state.schemaParts;
        // let schemeParts = list.find(sp => sp.schemeId == this.state.selectedScheme.id);
        // schemeParts.parts = newSchemePartsList.parts;
        // let part = schemeParts.parts.find(prt => prt.schemePartId == schemePartId);
        // part.count = newCount;
        this.setState({schemaParts : newSchemePartsList})
    }

    findElement(id, someList) {
        let element = someList.find(el => el.id == id);
        return element != undefined ? element : this.findElementInChilds(id, someList);
    }

    findElementInChilds(id, someList) {
        let element;
        for (let i = 0; i < someList.length; i++) {
            element = this.findElement(id, someList[i].childs);
            if (element != undefined)
                return element;
        }
        return element;
    }

    handleOnExpand(id) {
        let list = this.state.schemeList.slice();
        let schema = this.findElement(id, list);
        schema.isExpand = !schema.isExpand;
        this.setState({ schemeList: list });
    }

    handleOnSelect(id) {
        let list = this.state.schemeList.slice();
        let selected = this.findElement(id, list);
        this.setState({ selectedScheme: selected });
    }


    render() {
        return <div className="row">
                   <SchemeListBlock schemeList={this.state.schemeList}
                                    isAdmin ={this.state.isAdmin} 
                                    onExpand={this.handleOnExpand} 
                                    onSelect={this.handleOnSelect} 
                                    selectedSchemeId={this.state.selectedScheme != undefined ? this.state.selectedScheme.id : null }/>
    
                   {this.state.selectedScheme!= undefined ? <SchemeInfoBlock selctedSchemeImage = {this.state.selectedScheme.image}
                                                                             isAdmin ={this.state.isAdmin}
                                                                             onEditPart ={this.onEditPart}
                                                                             selectedSchemeId={this.state.selectedScheme.id}
                                                                             selectedSchemeName = {this.state.selectedScheme.name}
                                                                             schemeParts={this.state.schemaParts.find(pts => pts.schemeId == this.state.selectedScheme.id)}
                                                                             /> : 
                                                            null} 
                </div>
    }
}
{/*<div className="col-md-8">

        <Parts selectedSchemeId={this.state.selectedScheme.id} schemaParts={this.state.schemaParts.find(pts => pts.schemeId == this.state.selectedScheme.id) } />
        <Image selectedScheme={this.state.selectedScheme} />

    </div>*/}
const SchemeListBlock = (props) => <div className ="col-md-4">
                                         <SchemeList schemeList={props.schemeList}
                                                     onExpand={props.onExpand}
                                                     onSelect={props.onSelect}
                                                     selectedSchemeId={props.selectedSchemeId } />
                                   </div>;



class SchemeList extends React.Component
{
    render() {
        return <ul style={{ listStyleType: "none" } }>
                   {this.props.schemeList.map(scheme =>
                       <Scheme name={scheme.name} 
                               key={scheme.id} 
                               index={scheme.id}  
                               childs={scheme.childs} 
                               isExpand={scheme.isExpand}
                               onExpand={this.props.onExpand} 
                               onSelect= {this.props.onSelect} 
                               selectedSchemeId={this.props.selectedSchemeId} />)}
               </ul>
    };
}

class Scheme extends React.Component
{
    render()
    {
        return   <li>
     <ExpandButton onExpand={this.props.onExpand}
                   isExpand={this.props.isExpand}
                   index={this.props.index} 
                   childs={this.props.childs}/>

     <SelectButton selectedSchemeId={this.props.selectedSchemeId}
                   name={this.props.name}
                   onSelect={this.props.onSelect}
                   index={this.props.index} />

    {this.props.isExpand ? 
    <SchemeList schemeList={this.props.childs} 
                onSelect={this.props.onSelect} 
                onExpand={this.props.onExpand} 
                selectedSchemeId={this.props.selectedSchemeId} /> :
     null}
                 </li> 
    }
}

class ExpandButton extends React.Component
{
    render()
    {
        return this.props.childs.length > 0 ? 
        <button type="button" 
                className="btn btn-default btn-xs" 
                aria-label="Left Align" 
                onClick={this.props.onExpand.bind(this, this.props.index) }>
                <span className={!this.props.isExpand ? "glyphicon glyphicon-plus" : "glyphicon glyphicon-minus"} 
                      aria-hidden="true">
                </span> 
        </button> : 
        null
    }
}

class SelectButton extends React.Component 
{
    render()
    {
        return <button type="button" 
                       className={this.props.selectedSchemeId == this.props.index ? "btn btn-success" : "btn btn-default"} 
                       aria-label="Left Align" 
                       onClick={this.props.onSelect.bind(this, this.props.index) }>
                       {this.props.name} 
               </button>
    }
}


const SchemeInfoBlock = (props) => 
<div className="col-md-8">
    <PartListBlock isAdmin={props.isAdmin} 
                   onEditPart={props.onEditPart} 
                   schemeParts = {props.schemeParts} 
                   selectedSchemeId = {props.selectedSchemeId} 
                   selectedSchemeName = {props.selectedSchemeName}/>
    <ImageBlock image ={props.selctedSchemeImage}/>
</div>;

/*const PartListBlock = (props) =>
<div style = {{ height: 300}}>
    <AddPartButton/>
    {props.schemeParts == null ? <NoPartsMessage/> : <PartsTable/>}
</div>*/

class PartListBlock extends React.Component
{
    constructor(props)
    {
        super(props);
        this.state =
        {
            
            isAdmin : this.props.isAdmin,
            showAddModal : false,
            showEditModal : false,
            showDeleteModal : false
        }
        this.onEditPartButtonClick = this.onEditPartButtonClick.bind(this);
        this.onDeletePartButtonClick = this.onDeletePartButtonClick.bind(this);
        this.onAddPartButtonClick = this.onAddPartButtonClick.bind(this);
        this.close = this.close.bind(this);
        this.onConfirmEdit = this.onConfirmEdit.bind(this);
        this.onConfirmDelete = this.onConfirmDelete.bind(this);
    }

    close()
    {
        this.setState
        ({
            showAddModal : false,
            showEditModal : false,
            showDeleteModal : false
        });
    }

    onAddPartButtonClick()
    {
        this.setState
            ({
                showAddModal : true
            });
        
    
    }

    onEditPartButtonClick(schemePartId)
    {
        let parts = this.props.schemeParts.parts;
        let part = parts.find(prt => prt.schemePartId == schemePartId);
        this.setState
            ({
             showEditModal : true,
             editedSchemePart : part
            });
    }

    onDeletePartButtonClick(schemePartId)
    {
        let parts = this.props.schemeParts.parts;
        let part = parts.find(prt => prt.schemePartId == schemePartId);
        this.setState
            ({
             showDeleteModal : true,
             editedSchemePart : part
            });
    }

    

    onConfirmDelete(schemePartId, selectedSchemeId)
    {
        var self = this;
        fetch('Default/DeletePart', { 
            method  : 'post', 
            body : JSON.stringify({schemePartId : schemePartId, newCount : 0, schemeId : selectedSchemeId})
        })
        .then(function(response)
        {
            if(response.ok)
            {
                return response.json();
            }
            throw new Error('Network response was not ok.');
            
        })
        .then(function(response){
            {
                self.close();
                self.props.onEditPart(response);
            }
            
        })
        .catch(function(error) {
         console.log('There has been a problem with your fetch operation: ' + error.message);});
    }

    onConfirmEdit(schemePartId, count, selectedSchemeId)
    {
        var self = this;
        fetch('Default/EditPart', { 
            method  : 'post', 
            body : JSON.stringify({schemePartId : schemePartId, newCount : count, schemeId : selectedSchemeId})
        })
        .then(function(response)
        {
            if(response.ok)
            {
                return response.json();
            }
            throw new Error('Network response was not ok.');
            
        })
        .then(function(response){
            {
                self.close();
                self.props.onEditPart(response);
            }
            
        })
        .catch(function(error) {
         console.log('There has been a problem with your fetch operation: ' + error.message);});
    }

    render()
    {
        return <div style = {{ height: 300}}>
                   {/*<Select.Async  multi ="true" onChange = {this.onChange} loadOptions ={this.getArticles} />*/}
                   {this.state.isAdmin ? <AddPartButton onAddPartButtonClick = {this.onAddPartButtonClick} /> : null}
                   <AddPartModal selectedSchemeName = {this.props.selectedSchemeName}
                                 onClose = {this.close}
                                 show = {this.state.showAddModal}
                                 selectedSchemeId = {this.props.selectedSchemeId}/>
                   {this.state.editedSchemePart != null ? <EditPartModal   show = {this.state.showEditModal}
                                                                           onClose = {this.close}
                                                                           onConfirmEdit = {this.onConfirmEdit}
                                                                           part = {this.state.editedSchemePart}
                                                                           selectedSchemeId = {this.props.selectedSchemeId}
                                                                           selectedSchemeName = {this.props.selectedSchemeName}/> : null}

                   {this.state.editedSchemePart != null ? <DeletePartModal selectedSchemeName={this.props.selectedSchemeName}
                                                                           selectedSchemeId = {this.props.selectedSchemeId}
                                                                           onConfirmDelete = {this.onConfirmDelete} 
                                                                           show = {this.state.showDeleteModal}
                                                                           onClose = {this.close}
                                                                           part = {this.state.editedSchemePart}/> : null}

                   {this.props.schemeParts == null ? <NoPartsMessage/> : <PartsTable isAdmin={this.state.isAdmin}
                                                                                     schemeParts = {this.props.schemeParts}
                                                                                     onEditPartButtonClick ={this.onEditPartButtonClick}
                                                                                     onDeletePartButtonClick ={this.onDeletePartButtonClick} />}
               </div>  
    }
}
//<AddPartModal selectedSchemeName = {props.selectedSchemeName}/>

class AddPartModal extends React.Component
{
    constructor(props)
    {
        super(props);
        this.state =
        {
            isNewOption : false,
            article : '',
            name : '',
            count : 0,
        };
        this.onChange = this.onChange.bind(this);
        this.getArticles =this.getArticles.bind(this);
        this.onClose = this.onClose.bind(this);
        this.onNewOptionClick = this.onNewOptionClick.bind(this);
        // this.onValueClick = this.onValueClick.bind(this);
    }

    getArticles(input)
    {
        return fetch('Default/GetArticles', { 
            method  : 'post', 
            body : JSON.stringify({str : input})
        })
        .then(function(response)
        {
            if(response.ok)
            {
                return response.json();
            }
            throw new Error('Network response was not ok.');
            
        })
        .then(function(json){
            {
                return { options: json };
            }
            
        })
        .catch(function(error) {
         console.log('There has been a problem with your fetch operation: ' + error.message);});
    }

    onClose()
    {
        this.props.onClose();
        this.setState
        ({
            article : '',
            isNewOption : false,
            name : '',
            count : 0,
        });
    }

    

    // onValueClick(value, event)
    // {
        
    //     this.setState
    //     ({
    //         name : value.value
    //     });
    // }
    
    onChange(value)
    {
        if(value != null)
        {
            this.onNewOptionClick(value.className !=null);
        }
        this.setState
        ({
            article : value
        });
    }

    onNewOptionClick(isNew)
    {
        
        this.setState
        ({
            isNewOption : isNew
        });
    }

    render()
    {
        return <Modal show ={this.props.show} onHide={this.onClose}>
                    <Modal.Header closeButton>
                            <Modal.Title>Добаввить деталь:</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        
                            <label>Введите Артикул:</label>
                            <Select.AsyncCreatable multi ={false} value ={this.state.article} autoload={false}  onChange = {this.onChange}  loadOptions ={this.getArticles} />
                            
                            <label htmlFor="inputPartCount">Введите новое значение:</label>
                            <input type="text" value ={this.state.isNewOption  ? 'Новая опция' : 'Старая опция'}  className="form-control" />

                    </Modal.Body>
                    <Modal.Footer>
                        <button className="btn btn-primary"  onClick={this.onClose} >Подтвердить</button>
                        <Button onClick={this.onClose}>Отмена</Button>
                    </Modal.Footer>
              </Modal>
    }
}

class EditPartModal extends React.Component
{
    constructor(props)
    {
        super(props);
        this.state =
        {
            count : this.props.part.count
        };
        this.onChange = this.onChange.bind(this);
    }

    onChange(event)
    {
        this.setState({count : event.target.value});
    }

    render()
    {
        return <Modal show ={this.props.show} onHide={this.props.onClose}>
                    <Modal.Header closeButton>
                            <Modal.Title>Изменить кол-во деталей:</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <h4>Название:</h4>
                        <p>{this.props.part.name}</p>
                        <h4>Артикул:</h4>
                        <p>{this.props.part.article}</p>
                        <h4>Кол-во: {this.props.part.count}</h4>
                        <h4>В схеме:</h4>
                        <p>{this.props.selectedSchemeName}</p>
                        <hr/>
                        <form role="form">
                            <div className="form-group">
                                <label htmlFor="inputPartCount">Введите новое значение:</label>
                                <input type="number" value ={this.state.count} className="form-control"  onChange = {this.onChange}/>
                            </div>
                            
                        </form>
                    </Modal.Body>
                    <Modal.Footer>
                        <button className="btn btn-primary" onClick={this.props.onConfirmEdit.bind(this, this.props.part.schemePartId, this.state.count, this.props.selectedSchemeId)} >Подтвердить</button>
                        <Button onClick={this.props.onClose}>Отмена</Button>
                    </Modal.Footer>
              </Modal>
        
    }
}

const DeletePartModal = (props) =>
    <Modal show ={props.show} onHide={props.onClose}>
        <Modal.Header closeButton>
                <Modal.Title>Удалить деталь?:</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <h4>Название:</h4>
            <p>{props.part.name}</p>
            <h4>Артикул:</h4>
            <p>{props.part.article}</p>
            <h4>В схеме:</h4>
            <p>{props.selectedSchemeName}</p>
        </Modal.Body>
        <Modal.Footer>
            <button className="btn btn-primary" onClick={props.onConfirmDelete.bind(this, props.part.schemePartId, props.selectedSchemeId)} >Подтвердить</button>
            <Button onClick={props.onClose}>Отмена</Button>
        </Modal.Footer>
    </Modal>;

const AddPartButton = (props) => <button type="button" className="btn btn-primary" onClick={props.onAddPartButtonClick}>Добавить запчасть</button>;
const NoPartsMessage = () => <div className="alert alert-danger">Для данной схемы не заданы детали!</div>;
const PartsTable = (props) =>
 <table className="table table-hover table-bordered" >
        <thead>
            <tr>
                <th>№</th>
                <th>Название</th>
                <th>Артикул</th>
                <th>Кол-во</th>
                {props.isAdmin ? <td>Редактирование</td> : null}
            </tr>
        </thead>
        <tbody>
        {props.schemeParts.parts.map((part, index) => <Part name={part.name} 
                                                                 count={part.count} 
                                                                 article = {part.article}
                                                                 schemePartId = {part.schemePartId}
                                                                 onEditPartButtonClick ={props.onEditPartButtonClick}
                                                                 onDeletePartButtonClick ={props.onDeletePartButtonClick}
                                                                 key={index}
                                                                 index={index}
                                                                 isAdmin={props.isAdmin}/>)}
       </tbody>
 </table>;

const Part = (props) =>
   <tr>        
               <td>{props.index + 1}</td>
               <td>{props.name}</td>
               <td>{props.article}</td>
               <td>{props.count}</td>
               {props.isAdmin ? 
               <td>
                   <EditPartButton onEditPartButtonClick ={props.onEditPartButtonClick} schemePartId={props.schemePartId}/>
                   <DeletePartButton onDeletePartButtonClick ={props.onDeletePartButtonClick} schemePartId={props.schemePartId}/>
               </td> :
               null}
   </tr>;

const EditPartButton = (props) => <button type="button" className="btn btn-success" onClick={props.onEditPartButtonClick.bind(this, props.schemePartId)}>Исправить</button>;
const DeletePartButton = (props) => <button type="button" className="btn btn-danger" onClick={props.onDeletePartButtonClick.bind(this, props.schemePartId)}>Удалить</button>;


class ImageBlock extends React.Component {
    render() {
        return <img className="img-thumbnail" src={this.props.image} alt="Для данной схемы не задано изображение!"/>
        }
}


ReactDOM.render(
        <PartsCatalogue/>,
document.getElementById("root")
);



//class Parts extends React.Component {

//    constructor(props)
//    {
//        super(props);
//        this.state =
//            {
//                showModal: false,
//                selectedPart : null
//            }
//        this.onSelectRowInTable = this.onSelectRowInTable.bind(this);
//        this.open = this.open.bind(this);
//        this.close = this.close.bind(this);
//    }

//    close()
//    {
//        this.setState({ showModal: false });
//    }

//    open() {
//        this.setState({ showModal: true });
//    }

//    onSelectRowInTable(index)
//    {
//        var xxx = this.props.schemaParts.parts[index];
//        console.log(xxx);
//        this.setState({
//            selectedPart: xxx
//        });
//    }

//    render() {
//        if(this.props.schemaParts == null)
//        {
//            return <NoPartsMessage/>
//            }
            

//        return <div style={{ height: 300} }>
     
//    <div>
//        <Button
//        bsStyle="primary"
//        onClick={this.open} >
//        Изменить
//        </Button>

//    {this.props.selectedSchemeId != null && this.state.selectedPart != null ? <EditPartModalWindow show={this.state.showModal} onHide={this.close} selectedPart ={this.state.selectedPart }/> : null}
//    <table className="table table-hover table-bordered" >
//        <thead>
//            <tr>
//                <th>№</th>
//                <th>Название</th>
//                <th>Артикул</th>
//                <th>Кол-во</th>
//            </tr>
//        </thead>
//        <tbody>
//    {this.props.schemaParts.parts.map((part, index) =>
//                    <Part name={part.name} 
//        count={part.count}  
//        article = {part.article}
//        detailId = {part.detailId}
//        schemePartId = {part.schemePartId}
//        key={index}
//        onSelectRowInTable={this.onSelectRowInTable}
//        index={index}/>)}
//       </tbody>
//   </table> 
//   </div>

//            </div>
//       }
//       }

//value ={this.props.selectedPart!=null ? this.props.selectedPart.name : null}
//value ={this.props.selectedPart!=null ? this.props.selectedPart.name : null}
//class EditPartModalWindow extends React.Component
//       {
//    render()
//       {
//           return <Modal show={this.props.show} onHide={this.props.onHide}>
//           <Modal.Header closeButton>
//             <Modal.Title>Редактирование запчасти</Modal.Title>
//           </Modal.Header>
//           <Modal.Body>
//               {this.props.selectedPart.name}
//           {this.props.selectedPart.article}
//           {this.props.selectedPart.count} 
//           </Modal.Body>
//           <Modal.Footer>
//             <Button onClick={this.props.onHide}>Close</Button>
//           </Modal.Footer>
//         </Modal>
//       }
//}

//<form>
//  <div className="form-group">
//    <label for="exampleInputEmail1">Название</label>
//    <input type="text" className="form-control" id="formControlsPartName"  />
//  </div>
//  <div className="form-group">
//    <label for="exampleInputPassword1">Артикуль</label>
//    <input type="text" className="form-control" id="formControlsPartArticle"  />
//  </div>
  
  
//  <button type="submit" className="btn btn-default">Submit</button>
//          </form>


    

/*class Part extends React.Component
{
    render()
    {
        return <tr onClick={this.props.onSelectRowInTable.bind(this,this.props.index)}>        
                <td>{this.props.index + 1}</td>
                <td>{this.props.name}</td>
                <td>{this.props.article}</td>
                <td>{this.props.count}</td>
               </tr>
    }
}*/


//const Part = (props) =>
//    <tr onClick={props.onSel.bind}>        
//                <td>{props.index + 1}</td>
//                <td>{props.name}</td>
//                <td>{props.article}</td>
//        <td>{props.detailId}</td>
//        <td>{props.schemePartId}</td>
//                <td>{props.count}</td>
//               </tr>


