HA$PBExportHeader$w_cad_usuario.srw
forward
global type w_cad_usuario from w_ancestor
end type
type tab_funcionario from tab within w_cad_usuario
end type
type tabpage_pesquisa from uo_pesquisa_funcionario within tab_funcionario
end type
type tabpage_pesquisa from uo_pesquisa_funcionario within tab_funcionario
end type
type tabpage_cadastro from uo_cad_funcionario within tab_funcionario
end type
type tabpage_cadastro from uo_cad_funcionario within tab_funcionario
end type
type tab_funcionario from tab within w_cad_usuario
tabpage_pesquisa tabpage_pesquisa
tabpage_cadastro tabpage_cadastro
end type
end forward

global type w_cad_usuario from w_ancestor
integer width = 4055
integer height = 2620
string title = "Funcionarios"
string menuname = ""
windowtype windowtype = main!
string icon = ""
boolean clientedge = true
tab_funcionario tab_funcionario
end type
global w_cad_usuario w_cad_usuario

type variables
m_edit im_edit
end variables

forward prototypes
public subroutine of_set_estado (string as_estado)
end prototypes

public subroutine of_set_estado (string as_estado);is_estado = as_estado
tab_funcionario.tabpage_cadastro.of_set_estado( is_estado )
end subroutine

on w_cad_usuario.create
int iCurrent
call super::create
this.tab_funcionario=create tab_funcionario
iCurrent=UpperBound(this.Control)
this.Control[iCurrent+1]=this.tab_funcionario
end on

on w_cad_usuario.destroy
call super::destroy
destroy(this.tab_funcionario)
end on

event post_open;call super::post_open;m_edit.Hide()

Return 1
end event

event ue_incluir;call super::ue_incluir;If tab_funcionario.Selectedtab = 2 Then
	tab_funcionario.tabpage_cadastro.of_incluir( )
End If
end event

event activate;call super::activate;w_ancestor iw_this 

iw_this = This

If ParentWindow().Dynamic of_getwindowativa() = iw_this Then Return
	
ParentWindow().Dynamic of_set_window( this )
 
im_edit = ParentWindow().Dynamic of_get_menu()

If is_estado = '' Then of_set_estado( 'VIL' )
im_edit.of_enable( is_estado )

tab_funcionario.Tabpage_cadastro.of_set_menu( Ref im_edit )

end event

event ue_gravar;call super::ue_gravar;If tab_funcionario.Selectedtab = 2 Then
	tab_funcionario.tabpage_cadastro.of_gravar( )
End If
end event

event deactivate;call super::deactivate;w_ancestor lw_null

SetNull(lw_null)
//If Not ib_fechando Then ParentWindow().Dynamic of_set_window( lw_null )
end event

event ue_limpar;call super::ue_limpar;If tab_funcionario.Selectedtab = 2 Then
	tab_funcionario.tabpage_cadastro.of_limpar( )
End If
end event

event ue_excluir;call super::ue_excluir;If tab_funcionario.Selectedtab = 2 Then
	tab_funcionario.tabpage_cadastro.of_excluir( )
End If
end event

type tab_funcionario from tab within w_cad_usuario
integer x = 59
integer y = 36
integer width = 3680
integer height = 2396
integer taborder = 10
integer textsize = -10
integer weight = 700
fontcharset fontcharset = ansi!
fontpitch fontpitch = variable!
fontfamily fontfamily = swiss!
string facename = "Tahoma"
long backcolor = 67108864
boolean showpicture = false
integer selectedtab = 2
tabpage_pesquisa tabpage_pesquisa
tabpage_cadastro tabpage_cadastro
end type

on tab_funcionario.create
this.tabpage_pesquisa=create tabpage_pesquisa
this.tabpage_cadastro=create tabpage_cadastro
this.Control[]={this.tabpage_pesquisa,&
this.tabpage_cadastro}
end on

on tab_funcionario.destroy
destroy(this.tabpage_pesquisa)
destroy(this.tabpage_cadastro)
end on

type tabpage_pesquisa from uo_pesquisa_funcionario within tab_funcionario
integer x = 18
integer y = 112
integer width = 3643
integer height = 2268
string text = "Pesquisa"
end type

type tabpage_cadastro from uo_cad_funcionario within tab_funcionario
integer x = 18
integer y = 112
integer width = 3643
integer height = 2268
string text = "Cadastro"
end type

