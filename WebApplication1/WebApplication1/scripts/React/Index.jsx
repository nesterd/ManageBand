
var React = require('react');
var ReactDOM = require('react-dom');
var Modal = require('react-bootstrap').Modal;
var Button = require('react-bootstrap').Button;
var FieldGroup = require('react-bootstrap').FieldGroup;
var Select = require('react-select');
var FileInput = require('react-file-input');
import 'react-select/dist/react-select.css';



const ajaxRequest = (actionName, item, method, self) =>
    {
        var path = '/Default/'+actionName;

        fetch(path, { 
            method  : 'post', 
            body : JSON.stringify(item)
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
                self.close();
                method(json);
            }
            
        })
        .catch(function(error) {
         console.log('There has been a problem with your fetch operation: ' + error.message);});
    }

class PartsCatalogue extends React.Component
{
    constructor(props)
    {
        super(props);
        this.state = 
            {
                isAdmin : Boolean(window.isAdmin),
                schemeList: window.schemeList,
                schemaParts : window.schemePartsList,
                catalogueId : window.selectedCatalogueId
            };
        this.handleOnExpand = this.handleOnExpand.bind(this);
        this.handleOnSelect = this.handleOnSelect.bind(this);
        this.onEditPart = this.onEditPart.bind(this);
        this.onAddScheme = this.onAddScheme.bind(this);
        this.onDeleteScheme = this.onDeleteScheme.bind(this);
        this.onEditScheme = this.onEditScheme.bind(this);
    }

    onEditPart(newSchemePartsList)
    {
        let list = this.state.schemaParts.slice();
        let schemeParts = list.find(sp => sp.schemeId == this.state.selectedScheme.id);
        if(schemeParts == undefined)
            list.push(newSchemePartsList);
        else
            schemeParts.parts = newSchemePartsList.parts;

        this.setState({schemaParts : list});
    }

    onEditScheme(editedScheme)
    {
        let list = this.state.schemeList.slice();
        let oldScheme = this.findElement(editedScheme.id, list);
        oldScheme.name = editedScheme.name;
        oldScheme.image = editedScheme.image;

        this.setState({ schemeList: list });
    }

    onDeleteScheme(schemeToDelete)
    {
        let list = this.state.schemeList.slice();
        if(schemeToDelete.parentId == null)
        {
            let rootScheme =  list.find(x => x.id == schemeToDelete.id)
            list.splice(list.indexOf(schemeToDelete), 1)
        }
        else
        {
            let schema = this.findElement(schemeToDelete.parentId, list);
            let childsList = schema.childs;
            let childScheme = childsList.find(x => x.id == schemeToDelete.id);
            
            childsList.splice(childsList.indexOf(childScheme), 1);
        }
        this.setState({ schemeList: list });
    }

    onAddScheme(newScheme)
    {
        let list = this.state.schemeList.slice();
        if(newScheme.parentId == null)
        {
            list.push(newScheme)
        }
        else
        {
            let schema = this.findElement(newScheme.parentId, list);
            schema.childs.push(newScheme);
            schema.isExpand = true;

        }
        this.setState({ schemeList: list });
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
        return <div className="row" >
                   <SchemeListBlock schemeList={this.state.schemeList}
                                    isAdmin ={this.state.isAdmin}
                                    catalogueId = {this.state.catalogueId} 
                                    onExpand={this.handleOnExpand} 
                                    onSelect={this.handleOnSelect}
                                    onAddScheme = {this.onAddScheme}
                                    onEditScheme = {this.onEditScheme}
                                    onDeleteScheme = {this.onDeleteScheme} 
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

class SchemeListBlock extends React.Component
{
    constructor(props)
    {
        super(props);
        this.state =
        {
            isAdmin : this.props.isAdmin,
            isRootScheme : false,
            AddSchemeModalShow : false,
            EditSchemeModalShow : false,
            DeleteSchemeModalShow : false


        }
        this.close = this.close.bind(this);
        this.onConfirmAddScheme = this.onConfirmAddScheme.bind(this);
        this.onConfirmDeleteScheme = this.onConfirmDeleteScheme.bind(this);
        this.onAddRootSchemeButtonClick = this.onAddRootSchemeButtonClick.bind(this);
        this.onAddSchemeButtonClick = this.onAddSchemeButtonClick.bind(this);
        this.onEditSchemeButtonClick = this.onEditSchemeButtonClick.bind(this);
        this.onDeleteSchemeButtonClick = this.onDeleteSchemeButtonClick.bind(this);
        this.onConfirmEditScheme = this.onConfirmEditScheme.bind(this);
    }

    onConfirmEditScheme(name, imageFile)
    {
        // ajaxRequest('EditScheme', {name : name, id : this.state.Scheme.id, file : imageFile}, this.props.onEditScheme, this);
        var self = this;
        var path = '/Default/EditScheme';
        var data = new FormData();
        data.append('name', name);
        data.append('id', this.state.Scheme.id);
        data.append('image', imageFile);

        fetch(path, { 
            method  : 'post', 
            body : data
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
                self.close();
                self.props.onEditScheme(json);
            }
            
        })
        .catch(function(error) {
         console.log('There has been a problem with your fetch operation: ' + error.message);});
    }

    onConfirmAddScheme(name, imageFile, parentSchemeId)
    {
        // ajaxRequest('AddScheme', {name : name, parentId : parentSchemeId}, this.props.onAddScheme, this);
        var self = this;
        var path = '/Default/AddScheme';
        var data = new FormData();
        data.append('name', name);
        data.append('parentSchemeId', parentSchemeId);
        data.append('catalogueId', this.props.catalogueId)
        data.append('image', imageFile);

        fetch(path, { 
            method  : 'post', 
            body : data
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
                self.close();
                self.props.onAddScheme(json);
            }
            
        })
        .catch(function(error) {
         console.log('There has been a problem with your fetch operation: ' + error.message);});
    }

    onConfirmDeleteScheme()
    {
        ajaxRequest('DeleteScheme', this.state.Scheme.id, this.props.onDeleteScheme, this);
    }

    onAddRootSchemeButtonClick()
    {
        this.setState
        ({
            isRootScheme : true,
            AddSchemeModalShow : true,
            Scheme : {name : '', id : 0},
        });
    }

    onAddSchemeButtonClick(name, index)
    {
        this.setState
        ({
            isRootScheme : false,
            AddSchemeModalShow : true,
            Scheme : {name : name, id : index},
        });
    }

    onEditSchemeButtonClick(name, index)
    {
        this.setState
        ({
            EditSchemeModalShow : true,
            Scheme : {name : name, id : index},
        });
    }

    onDeleteSchemeButtonClick(name, index)
    {
        this.setState
        ({
            DeleteSchemeModalShow : true,
            Scheme : {name : name, id : index},
        });
    }

    close()
    {
        this.setState
        ({
            Scheme : null,
            AddSchemeModalShow : false,
            EditSchemeModalShow : false,
            DeleteSchemeModalShow : false
        }); 
    }

    render()
    {
        return <div className ="col-md-4 schemeList"  >
                    {this.state.isAdmin ? <AddRootSchemeButton onAddRootSchemeButtonClick = {this.onAddRootSchemeButtonClick} /> : null}
                    {this.state.Scheme == null ? null : <DeleteSchemeModal show={this.state.DeleteSchemeModalShow}
                                                                                   onConfirmDeleteScheme = {this.onConfirmDeleteScheme}
                                                                                   onClose={this.close}
                                                                                   name = {this.state.Scheme.name}
                                                                                   id = {this.state.Scheme.id}/>}
                    {this.state.Scheme == null ? null : <EditSchemeModal show={this.state.EditSchemeModalShow}
                                                                                   onClose={this.close}
                                                                                   onConfirmEditScheme = {this.onConfirmEditScheme}
                                                                                   name = {this.state.Scheme.name}
                                                                                   id = {this.state.Scheme.id}/>}
                    {this.state.Scheme == null ? null : <AddSchemeModal show={this.state.AddSchemeModalShow}
                                                                                   onClose={this.close}
                                                                                   onConfirmAddScheme = {this.onConfirmAddScheme}
                                                                                   isRootScheme = {this.state.isRootScheme}
                                                                                   parentSchemeName = {this.state.Scheme.name}
                                                                                   parentSchemeId = {this.state.Scheme.id}/>}
                    
                    <SchemeList schemeList={this.props.schemeList}
                                onExpand={this.props.onExpand}
                                onAddSchemeButtonClick = {this.onAddSchemeButtonClick}
                                onEditSchemeButtonClick = {this.onEditSchemeButtonClick}
                                onDeleteSchemeButtonClick ={this.onDeleteSchemeButtonClick}
                                isAdmin = {this.state.isAdmin}
                                onSelect={this.props.onSelect}
                                selectedSchemeId={this.props.selectedSchemeId } />
               </div>
    }
}

class AddSchemeModal extends React.Component
{
    constructor(props)
    {
        super(props);
        this.state =
        {
            name : ''
        }
        this.onChangeName = this.onChangeName.bind(this);
        this.onClose = this.onClose.bind(this);
        this.onConfirm = this.onConfirm.bind(this);
        this.onChangeImage = this.onChangeImage.bind(this);
    }

    onChangeImage(event)
    {
        this.setState
        ({
            imageFile : event.target.files[0]
        })
        console.log('Selected file:', event.target.files[0]);
    }

    onConfirm()
    {
        let parentSchemeId = (this.props.isRootScheme ? null : this.props.parentSchemeId);
        this.props.onConfirmAddScheme(this.state.name, this.state.imageFile, parentSchemeId)
        this.setState
        ({
            name : '',
            imageFile : null
        });
    }

    onClose()
    {
        this.props.onClose();
        this.setState
        ({
            name : ''
        });
    }

    onChangeName(event)
    {
        
        this.setState
        ({
            name : event.target.value
        });
    }



    render()
    {
        return <Modal show ={this.props.show} onHide={this.onClose}>
                    <Modal.Header closeButton>
                            <Modal.Title>Добавление схемы</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <p>{this.props.isRootScheme ? "корневая схема" : "дочерняя схема"}</p>
                        <h4>Название:</h4>
                        <input type="text" className="form-control" autoFocus={true} value ={this.state.name} onChange={this.onChangeName}/>
                        <label >Изображение:</label>
                        <input type="file"  onChange={this.onChangeImage}/>
                    </Modal.Body>
                    <Modal.Footer>
                        <button className="btn btn-primary"  onClick={this.onConfirm}>Подтвердить</button>
                        <Button onClick={this.onClose}>Отмена</Button>
                    </Modal.Footer>
              </Modal>
    }
}

class EditSchemeModal extends React.Component
{
    constructor(props)
    {
        super(props);
        this.state =
        {
            name : this.props.name
        }
        this.onChangeName = this.onChangeName.bind(this);
        this.onClose = this.onClose.bind(this);
        this.onChangeImage = this.onChangeImage.bind(this);
    }

    onChangeImage(event)
    {
        this.setState
        ({
            imageFile : event.target.files[0]
        })
        console.log('Selected file:', event.target.files[0]);
    }

    onChangeName(event)
    {
        this.setState
        ({
            name : event.target.value
        });

    }

    onClose()
    {
        this.props.onClose();
    }


    render()
    {
        return <Modal show ={this.props.show} onHide={this.onClose}>
                    <Modal.Header closeButton>
                            <Modal.Title>Редактировать схему?</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <h4>Название:</h4>
                        {/*<form>*/}
                        {/*<form >*/}
                            <div className="form-group">
                                <label >Название:</label>
                                <input type="text" className="form-control" autoFocus={true} value ={this.state.name} onChange={this.onChangeName}/>
                            </div>
                            <div className="form-group">
                                <label >Изображение:</label>
                                <input type="file"  onChange={this.onChangeImage}/>
                            </div>
                            {/*<form>
                                <FileInput name="myImage"
                                       accept=".png,.gif"
                                       placeholder="My Image"
                                       className="inputClass"
                                       onChange={this.handleChange} />

                            </form>*/}
                            
                            {/*<hr/>*/}
                            {/*<button type="submit" className="btn btn-primary">Submit</button>
                            <Button onClick={this.onClose}>Отмена</Button>*/}
                        {/*</form>*/}
                        {/*<input type="text" className="form-control" value ={this.state.name} onChange={this.onChangeName}/>
                        <input type="file" id="exampleInputFile"/>*/}
                    </Modal.Body>
                    <Modal.Footer>
                        <button className="btn btn-primary"  onClick={this.props.onConfirmEditScheme.bind(this, this.state.name, this.state.imageFile)}>Подтвердить</button>
                        <Button onClick={this.onClose}>Отмена</Button>
                    </Modal.Footer>
              </Modal>
    }
}

const DeleteSchemeModal = (props) =>
    <Modal show ={props.show} onHide={props.onClose}>
        <Modal.Header closeButton>
                <Modal.Title>Удалить схему?</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <h4>Название:</h4>
            <p>{props.name}</p>
            <hr/>
            <div className="alert alert-danger" role="alert"><span className="glyphicon glyphicon-exclamation-sign" aria-hidden="true"></span> Внимание: удаление схемы повлечет за собой удаление всех дочерних схем!</div>
        </Modal.Body>
        <Modal.Footer>
            <button className="btn btn-primary"  onClick={props.onConfirmDeleteScheme}>Подтвердить</button>
            <Button onClick={props.onClose}>Отмена</Button>
        </Modal.Footer>
    </Modal>;

const AddRootSchemeButton = (props) => <button type="button" className="btn btn-primary" onClick={props.onAddRootSchemeButtonClick}>Добавить схему</button>;

class SchemeList extends React.Component
{
    render() {
        return <ul style={{ listStyleType: "none" } }>
                   {this.props.schemeList.map(scheme =>
                       <Scheme name={scheme.name} 
                               key={scheme.id}
                               isAdmin = {this.props.isAdmin} 
                               index={scheme.id}  
                               childs={scheme.childs} 
                               isExpand={scheme.isExpand}
                               onExpand={this.props.onExpand} 
                               onSelect= {this.props.onSelect}
                               onAddSchemeButtonClick = {this.props.onAddSchemeButtonClick}
                               onEditSchemeButtonClick = {this.props.onEditSchemeButtonClick}
                               onDeleteSchemeButtonClick ={this.props.onDeleteSchemeButtonClick} 
                               selectedSchemeId={this.props.selectedSchemeId} />)}
               </ul>
    };
}

class Scheme extends React.Component
{
    render()
    {
        return   <li>
            <div style={{ whiteSpace : "nowrap"}}>
<ExpandButton onExpand={this.props.onExpand}
                   isExpand={this.props.isExpand}
                   index={this.props.index} 
                   childs={this.props.childs}/>

     <SelectButton selectedSchemeId={this.props.selectedSchemeId}
                   name={this.props.name}
                   isAdmin = {this.props.isAdmin} 
                   onSelect={this.props.onSelect}
                   onAddSchemeButtonClick = {this.props.onAddSchemeButtonClick}
                   onEditSchemeButtonClick = {this.props.onEditSchemeButtonClick}
                   onDeleteSchemeButtonClick ={this.props.onDeleteSchemeButtonClick} 
                   index={this.props.index} />
            </div>
     

    {this.props.isExpand ? 
    <SchemeList schemeList={this.props.childs} 
                onSelect={this.props.onSelect}
                isAdmin = {this.props.isAdmin} 
                onExpand={this.props.onExpand}
                onAddSchemeButtonClick = {this.props.onAddSchemeButtonClick}
                onEditSchemeButtonClick = {this.props.onEditSchemeButtonClick}
                onDeleteSchemeButtonClick ={this.props.onDeleteSchemeButtonClick} 
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
                className="btn btn-link btn-xs"
                style ={{ display : "inline-block"}} 
                aria-label="Left Align" 
                onClick={this.props.onExpand.bind(this, this.props.index) }>
                <span className={!this.props.isExpand ? "glyphicon glyphicon-plus" : "glyphicon glyphicon-minus"} 
                      aria-hidden="true">
                </span> 
        </button> : 
        <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span> 
    }
}



class SelectButton extends React.Component 
{
    constructor(props)
    {
        super(props);
        this.state =
        {
            
        }
    }
    calcButtonCoordinats()
    {
        let element = ReactDOM.findDOMNode(this.button);
        let elementCoordinats = element.getBoundingClientRect();
        let elementHeight = element.scrollHeight;
        let top = elementCoordinats.top + elementHeight;
        let left = elementCoordinats.left
        console.log(elementHeight);

        this.setState
        ({
            style : { position : "fixed", top : top, left : left}
        })


    }
// className="btn-group" style={{ whiteSpace : "nowrap"}}
// style ={{ display : "inline-block"}}
    render()
    {
        return <div style={{ whiteSpace : "nowrap", display : "inline-block"}} >
                    <button type="button" 
                            className={"btn btn-" + (this.props.selectedSchemeId == this.props.index ? "success" : "default") }
                            
                            aria-label="Left Align" 
                            onClick={this.props.onSelect.bind(this, this.props.index) }>
                            {this.props.name} 
                    </button>
                    {this.props.isAdmin ? <button type="button" 
                                                  className={"btn btn-"+ (this.props.selectedSchemeId == this.props.index ? "success" : "default")+" dropdown-toggle"}
                                                  onClick ={this.calcButtonCoordinats.bind(this)}
                                                  ref ={(button) => { this.button = button}}
                                                  
                                                  data-toggle="dropdown" 
                                                  aria-haspopup="true" 
                                                  aria-expanded="false">
                                            <span className="caret"></span>
                                            <span className="sr-only">Toggle Dropdown</span>
                                         </button>
                    
                                         :null}
                    <ul className="dropdown-menu" style={this.state.style}>
                        <li><a href="#" onClick ={this.props.onAddSchemeButtonClick.bind(this, this.props.name, this.props.index)}>Добавить дочернюю схему</a></li>
                        <li><a href="#" onClick ={this.props.onEditSchemeButtonClick.bind(this, this.props.name, this.props.index)}>Редактировать</a></li>
                        <li role="separator" className="divider"></li>
                        <li><a href="#" onClick ={this.props.onDeleteSchemeButtonClick.bind(this, this.props.name, this.props.index)}>Удалить</a></li>
                    </ul>
             </div>
    }
}

// style={{ position : "fixed"}}

const SchemeInfoBlock = (props) => 
<div className="col-md-8 schemeInfoBlock" >
    {/*<h2>{props.selectedSchemeName}</h2>*/}
    <h3>{props.selectedSchemeName} </h3>
    <PartListBlock isAdmin={props.isAdmin} 
                   onEditPart={props.onEditPart} 
                   schemeParts = {props.schemeParts} 
                   selectedSchemeId = {props.selectedSchemeId} 
                   selectedSchemeName = {props.selectedSchemeName}/>
    <ImageBlock image ={props.selctedSchemeImage}/>
</div>;

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
        this.onConfirmAddSchemePart = this.onConfirmAddSchemePart.bind(this);
    }

    close()
    {
        this.setState
        ({
            showAddModal : false,
            showEditModal : false,
            showDeleteModal : false,
            editedSchemePart : null
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
    onConfirmAddSchemePart(article, name, count)
    {
        ajaxRequest('AddSchemePart', {article : article, name : name, count : count, schemeId : this.props.selectedSchemeId}, this.props.onEditPart, this);

    }

    onConfirmDelete(schemePartId)
    {
        ajaxRequest('DeletePart',{schemePartId : schemePartId, newCount : 0, schemeId : this.props.selectedSchemeId}, this.props.onEditPart, this);
    }

    onConfirmEdit(schemePartId, count)
    {
        ajaxRequest('EditPart', {schemePartId : schemePartId, newCount : count, schemeId : this.props.selectedSchemeId}, this.props.onEditPart, this);
    }

    render()
    {
        return <div className="partListBlock">
                   {this.state.isAdmin ? <AddPartButton onAddPartButtonClick = {this.onAddPartButtonClick} /> : null}
                   <AddPartModal selectedSchemeName = {this.props.selectedSchemeName}
                                 onClose = {this.close}
                                 onConfirmAddSchemePart ={this.onConfirmAddSchemePart}
                                 show = {this.state.showAddModal}/>
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

                   {(this.props.schemeParts == null || this.props.schemeParts.parts.length == 0) ? <NoPartsMessage/> : <PartsTable isAdmin={this.state.isAdmin}
                                                                                     schemeParts = {this.props.schemeParts}
                                                                                     onEditPartButtonClick ={this.onEditPartButtonClick}
                                                                                     onDeletePartButtonClick ={this.onDeletePartButtonClick} />}
               </div>  
    }
}

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
        this.onChangeArticle = this.onChangeArticle.bind(this);
        this.clear = this.clear.bind(this);
        this.onConfirm = this.onConfirm.bind(this);
        this.onChangeName = this.onChangeName.bind(this);
        this.onChangeCount = this.onChangeCount.bind(this);
        this.getArticles =this.getArticles.bind(this);
        this.onClose = this.onClose.bind(this);
        this.onNewOptionClick = this.onNewOptionClick.bind(this);
    }

    getArticles(input)
    {
        // return ajaxRequest('GetArticles', input, (json) => { return { options: json }});
        return fetch('/Default/GetArticles', { 
            method  : 'post', 
            body : JSON.stringify(input)
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

    onConfirm()
    {
        this.onClose();
        this.props.onConfirmAddSchemePart(this.state.article.value, this.state.name, this.state.count);

    }

    clear()
    {
        this.setState
        ({
            article : '',
            isNewOption : false,
            name : '',
            count : 0,
        });
    }

    onClose()
    {
        this.props.onClose();
        this.clear();
    }

    onChangeName(event)
    {
        this.setState 
        ({
            name : event.target.value

        });
    }

    onChangeCount(event)
    {
        this.setState
        ({
            count : event.target.value
        });
    }

    onChangeArticle(value)
    {
        
        this.setState
        ({
            article : value,
            name: '',
            count : 0,
            isNewOption : false
        });
        if(value != null)
        {
            this.onNewOptionClick(value.className !=null);
        }
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
                        
                            <label>Артикул:</label>
                            <Select.AsyncCreatable multi ={false} 
                                                   value ={this.state.article} 
                                                   autofocus
                                                   autoload={false} 
                                                   promptTextCreator={(label) => 'Добавить новую деталь c артикулом: ' + '"'+label+'"'} 
                                                   onChange = {this.onChangeArticle}
                                                   loadOptions ={this.getArticles} />
                            
                            {this.state.isNewOption ? <div>
                                                        <label>Название:</label>
                                                        <input type="text" className="form-control" value = {this.state.name} onChange={this.onChangeName}/>
                                                      </div> : null}

                            <label>Кол-во:</label>
                            <input type="Number" className="form-control" value = {this.state.count} onChange={this.onChangeCount}/>
                            

                    </Modal.Body>
                    <Modal.Footer>
                        <button className="btn btn-primary"  onClick={this.onConfirm} >Подтвердить</button>
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
                                <label htmlFor="inputPartCount">Кол-во:</label>
                                <input type="number" autoFocus={true} value ={this.state.count} className="form-control"  onChange = {this.onChange}/>
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
        <tbody >
            
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


class ImageBlock extends React.Component 
{
    render() {
        return <img className="img-thumbnail" src={this.props.image} alt="Для данной схемы не задано изображение!"/>
        }
}


ReactDOM.render(
        <PartsCatalogue/>,
document.getElementById("root")
);






