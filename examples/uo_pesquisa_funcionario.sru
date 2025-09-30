HA$PBExportHeader$uo_pesquisa_funcionario.sru
forward
global type uo_pesquisa_funcionario from u_uo
end type
type cb_ok from u_cb within uo_pesquisa_funcionario
end type
type dw_filtro from u_dw within uo_pesquisa_funcionario
end type
type dw_funcionario from u_dw within uo_pesquisa_funcionario
end type
type gb_func from u_gb within uo_pesquisa_funcionario
end type
type gb_filtros from u_gb within uo_pesquisa_funcionario
end type
end forward

global type uo_pesquisa_funcionario from u_uo
integer width = 3700
integer height = 2300
cb_ok cb_ok
dw_filtro dw_filtro
dw_funcionario dw_funcionario
gb_func gb_func
gb_filtros gb_filtros
end type
global uo_pesquisa_funcionario uo_pesquisa_funcionario

type variables
string filtro_nome, filtro_codigo, filtro_cpf, filtro_funcao
w_ancestor iw_pai
end variables

forward prototypes
public subroutine of_inicializar ()
public subroutine of_filter (long row, string name)
public subroutine of_retrieve ()
public subroutine of_editar (long il_codigo)
end prototypes

public subroutine of_inicializar ();
iw_pai = GetParent().GetParent() 

dw_filtro.of_set_w_pai( iw_pai )
dw_filtro.of_set_color_background( )
dw_filtro.InsertRow(0)

dw_funcionario.SetTransObject(SQLCA)
dw_funcionario.retrieve( filtro_cpf, filtro_codigo , filtro_nome, filtro_funcao )
end subroutine

public subroutine of_filter (long row, string name);String ls_filter, data

dw_filtro.AcceptText()

Choose Case name
	Case 'fun_funcao'
		data = Trim(uf_null(dw_filtro.GetItemString(1, name ), ''))
		filtro_funcao = data
	Case 'fun_cpf'
		data = Trim(uf_null(dw_filtro.GetItemString(1, name ), ''))
		filtro_cpf = data
	Case 'fun_nome'	
		data = Trim(uf_null(dw_filtro.GetItemString(1, name ), ''))
		filtro_nome = data
	Case 'fun_codigo'	
		data = uf_null(String(dw_filtro.GetItemNumber(1, name )),'')
		If data = '0' then data = ''
		filtro_codigo = data
End Choose

If Len(filtro_codigo) > 0 Then &
	ls_filter += "If( Pos(String(fun_codigo), '" + filtro_codigo + "') > 0 , 1,0) = 1 and "	
If Len(filtro_nome) > 0 Then &
	ls_filter += "If( Pos(String(fun_nome), '" + filtro_nome + "') > 0 , 1,0) = 1 and "	
If Len(filtro_cpf) > 0 Then &
	ls_filter += "If( Pos(String(fun_cpf), '" + filtro_cpf + "') > 0 , 1,0) = 1 and "	
If Len(filtro_funcao) > 0 Then &
	ls_filter += "If( Pos(String(fun_funcao), '" + filtro_funcao + "') > 0 , 1,0) = 1 and "	

ls_filter = Left(ls_filter, Len(ls_filter) - 5)

dw_funcionario.setFilter( ls_filter )	
dw_funcionario.Filter()
	
	
end subroutine

public subroutine of_retrieve ();dw_funcionario.Retrieve( filtro_cpf, filtro_codigo , filtro_nome, filtro_funcao )
end subroutine

public subroutine of_editar (long il_codigo);w_cad_usuario lw_cad
lw_cad = iw_pai
lw_cad.tab_funcionario.tabpage_cadastro.of_editar( il_codigo )
lw_cad.tab_funcionario.SelectTab( 2)

end subroutine

event dragdrop;call super::dragdrop;//
end event

on uo_pesquisa_funcionario.create
int iCurrent
call super::create
this.cb_ok=create cb_ok
this.dw_filtro=create dw_filtro
this.dw_funcionario=create dw_funcionario
this.gb_func=create gb_func
this.gb_filtros=create gb_filtros
iCurrent=UpperBound(this.Control)
this.Control[iCurrent+1]=this.cb_ok
this.Control[iCurrent+2]=this.dw_filtro
this.Control[iCurrent+3]=this.dw_funcionario
this.Control[iCurrent+4]=this.gb_func
this.Control[iCurrent+5]=this.gb_filtros
end on

on uo_pesquisa_funcionario.destroy
call super::destroy
destroy(this.cb_ok)
destroy(this.dw_filtro)
destroy(this.dw_funcionario)
destroy(this.gb_func)
destroy(this.gb_filtros)
end on

type cb_ok from u_cb within uo_pesquisa_funcionario
integer x = 3063
integer y = 176
integer taborder = 20
boolean default = true
end type

event clicked;call super::clicked;of_retrieve()
end event

type dw_filtro from u_dw within uo_pesquisa_funcionario
integer x = 64
integer y = 60
integer width = 3474
integer height = 228
integer taborder = 10
string dataobject = "d_filtro_funcionario"
boolean border = false
end type

event itemchanged;call super::itemchanged;If dwo.name = 'fun_funcao' Then
	this.event editchanged( row , dwo , data )
End if
end event

event editchanged;call super::editchanged;of_filter( row, dwo.name )



end event

type dw_funcionario from u_dw within uo_pesquisa_funcionario
integer x = 27
integer y = 416
integer width = 3557
integer height = 1784
integer taborder = 30
string dataobject = "d_pesquisa_funcionario"
end type

event clicked;call super::clicked;If dwo.name = 'b_editar' Then of_editar( this.GetItemNumber(row, 'fun_codigo') )
end event

type gb_func from u_gb within uo_pesquisa_funcionario
integer y = 344
integer width = 3621
integer height = 1896
integer weight = 700
string text = "Funcionarios"
end type

type gb_filtros from u_gb within uo_pesquisa_funcionario
integer width = 3621
integer height = 316
integer weight = 700
string text = "Filtros"
end type

