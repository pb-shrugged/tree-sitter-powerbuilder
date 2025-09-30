HA$PBExportHeader$uo_cad_funcionario.sru
forward
global type uo_cad_funcionario from u_uo
end type
type dw_cad_funcionario from u_dw within uo_cad_funcionario
end type
end forward

global type uo_cad_funcionario from u_uo
integer width = 3698
integer height = 2300
dw_cad_funcionario dw_cad_funcionario
end type
global uo_cad_funcionario uo_cad_funcionario

type variables
nv_dados inv_dados
w_cad_usuario iw_pai
Boolean lb_alterando = False, lb_inserindo = False
end variables

forward prototypes
public subroutine of_inicializar ()
public subroutine of_incluir ()
public subroutine of_gravar ()
public function boolean of_validar ()
public subroutine of_limpar ()
public subroutine of_set_menu (m_edit am)
public function integer of_create_userdb (string as_nome, string as_pw)
public subroutine of_excluir ()
public subroutine of_editar (long al_codigo)
public function long of_delete_userdb (string al_user)
public function integer of_alter_userdb (string old_user, string new_user, string as_pw)
public function integer of_altergroup_userdb (string as_user, string new_group, string old_group)
end prototypes

public subroutine of_inicializar ();w_ancestor lw_pai

inv_dados = Create nv_dados

lw_pai = GetParent().GetParent()

dw_cad_funcionario.of_set_w_pai( lw_pai )
dw_cad_funcionario.of_set_color_background( )
dw_cad_funcionario.SetTransObject(SQLCA)
This.Of_limpar()

end subroutine

public subroutine of_incluir ();longlong ll_codigo
ll_codigo = inv_dados.of_get_nextval( 'dba.fun_codigo')
If ll_codigo <= 0 Then
	Msg('Erro ao buscar contador')
	Return
Else
	dw_cad_funcionario.SetRedraw( False )
	lb_alterando = False
	lb_inserindo = True
	iw_pai.of_set_estado('GEVL')
	im_edit.of_enable(is_estado)
	dw_cad_funcionario.Reset()
	dw_cad_funcionario.InsertRow(0)
	dw_cad_funcionario.of_bloq_campo( {"fun_codigo"}, true)
	dw_cad_funcionario.SetItem( 1, 'fun_codigo', ll_codigo)
	dw_cad_funcionario.of_bloq_campo( {"senhae", "fun_nome", "fun_funcao", "fun_senha", "fun_cpf"}, false)
	dw_cad_funcionario.SetRedraw( True )
End If
end subroutine

public subroutine of_gravar ();dw_cad_funcionario.SetRedraw( False )

dw_cad_funcionario.accepttext( )

If Not of_Validar() Then 
	dw_cad_funcionario.SetRedraw( True )
	Return
End If 

If inv_dados.Update( { dw_cad_funcionario} ) = 1 Then
	Msg("Gravado com Sucesso")
	This.of_limpar( )
Else
	Msg("Erro ao Gravar")
End If

dw_cad_funcionario.SetRedraw( True )
end subroutine

public function boolean of_validar ();String ls_cpf, ls_senha, ls_senhae, ls_nome, ls_funcao, ls_nova_senha
nv_datastore lds_funcionario

ls_cpf = Trim(uf_null(dw_cad_funcionario.GetItemString(1,'fun_cpf'), ''))
ls_senha = Trim(uf_null(dw_cad_funcionario.GetItemString(1,'fun_senha'), ''))
ls_senhae = Trim(uf_null(dw_cad_funcionario.GetItemString(1,'senhae'), ''))
ls_nome = Trim(uf_null(dw_cad_funcionario.GetItemString(1,'fun_nome'), ''))
ls_funcao = Trim(uf_null(dw_cad_funcionario.GetItemString(1,'fun_funcao'), ''))

If Len(ls_nome) <=0 Then dw_cad_funcionario.SetItem(1, 'fun_nome', 'Nome padrao')
If Len(ls_funcao) <=0 Then dw_cad_funcionario.SetItem(1, 'fun_funcao', 'Vendedor')

If Len(ls_cpf) <= 0 Then 
	Msg('CPF Obrigatorio')
	dw_cad_funcionario.Setfocus( )
	dw_cad_funcionario.SetColumn('fun_cpf')
	Return False
End IF

If Len(ls_senha) <= 0 Then 
	Msg('Senha Obrigatorio')
	dw_cad_funcionario.Setfocus( )
	dw_cad_funcionario.SetColumn('fun_senha')
	Return False
End IF


If ls_senha <> ls_senhae Then 
	Msg('Senha N$$HEX1$$e300$$ENDHEX$$o s$$HEX1$$e300$$ENDHEX$$o iguais')
	dw_cad_funcionario.Setfocus( )
	dw_cad_funcionario.SetColumn('fun_senha')
	Return False
End IF

If lb_inserindo and Not lb_Alterando Then
	lds_funcionario = Create nv_datastore
	lds_funcionario.of_create_from_sql( &
		"select fun_nome, fun_codigo from DBA.TB_FUNCIONARIOS " + &
		"where fun_cpf = '" + dw_cad_funcionario.GetItemString(1,'fun_cpf') + "'", True)
	If lds_funcionario.RowCount( ) > 0 Then 
		Msg('CPF j$$HEX2$$e1002000$$ENDHEX$$cadastrado')
		dw_cad_funcionario.Setfocus( )
		dw_cad_funcionario.SetColumn('fun_cpf')
		Destroy(lds_funcionario)
		Return False
	End If
	Destroy(lds_funcionario)
	If of_create_userDB( (Lower(Left(ls_funcao,1)) + ls_cpf) , ls_senha ) <> 1 Then
		Msg('Erro ao criar Usuario')
		RollBack Using SQLCA;
		Return False
	End If
	If of_altergroup_userDB( (Lower(Left(ls_funcao,1)) + ls_cpf) , lower(ls_funcao), '' ) <> 1 Then
		Msg('Erro ao criar Usuario')
		RollBack Using SQLCA;
		Return False
	End If
	
ElseIf Not lb_inserindo and lb_Alterando Then
	String old_funcao, old_cpf, old_senha
	old_funcao = Trim(uf_null(dw_cad_funcionario.GetItemString(1,'fun_funcao', Primary!, true), ''))
	old_cpf = Trim(uf_null(dw_cad_funcionario.GetItemString(1,'fun_cpf',Primary!, true), ''))
	old_senha = Trim(uf_null(dw_cad_funcionario.GetItemString(1,'fun_senha',Primary!, true), ''))
	if old_senha <> ls_senha or old_cpf <> ls_cpf or old_funcao <> ls_funcao Then
		If old_cpf <> ls_cpf Then
			lds_funcionario = Create nv_datastore
			lds_funcionario.of_create_from_sql( &
				"select fun_nome, fun_codigo from DBA.TB_FUNCIONARIOS " + &
				"where fun_cpf = '" + dw_cad_funcionario.GetItemString(1,'fun_cpf') + "'", True)
			If lds_funcionario.RowCount( ) > 0 Then 
				Msg('CPF j$$HEX2$$e1002000$$ENDHEX$$cadastrado')
				dw_cad_funcionario.Setfocus( )
				dw_cad_funcionario.SetColumn('fun_cpf')
				Destroy(lds_funcionario)
				Return False
			End If
			Destroy(lds_funcionario)
		End If
		If old_senha <> ls_senha Then 
			ls_nova_senha = ls_senha
		Else
			ls_nova_senha = ''
		End If
		If of_alter_userDB((Lower(Left(old_funcao,1)) + old_cpf), (Lower(Left(ls_funcao,1)) + ls_cpf) , ls_nova_senha ) <> 1 Then
			Msg('Erro ao Alterar Usuario')
			RollBack Using SQLCA;
			Return False
		End If
		If old_funcao <> ls_funcao Then
			If of_altergroup_userDB( (Lower(Left(ls_funcao,1)) + ls_cpf) , lower(ls_funcao), lower(old_funcao) ) <> 1 Then
				Msg('Erro ao criar Usuario')
				RollBack Using SQLCA;
				Return False
			End If
		End If
	End If
End If

Return True
end function

public subroutine of_limpar ();dw_cad_funcionario.SetRedraw( False )

dw_cad_funcionario.Reset()
dw_cad_funcionario.InsertRow(0)
dw_cad_funcionario.of_bloq_campo( {"fun_codigo"}, false )
dw_cad_funcionario.of_bloq_campo( {"senhae", "fun_nome", "fun_funcao", "fun_senha", "fun_cpf"}, true )
iw_pai.of_set_estado('VIL')
im_edit.of_enable(is_estado)

lb_alterando = False
lb_inserindo = False

dw_cad_funcionario.SetRedraw( True )
end subroutine

public subroutine of_set_menu (m_edit am);im_edit = am
end subroutine

public function integer of_create_userdb (string as_nome, string as_pw);long ll_retorno
String ls_sql
nv_DataStore lds

ls_sql = "SELECT DBA.CREATE_USERDB('"+ as_nome +"' , '"+ as_pw +"') AS RET from public.DUMMY" ;

lds = Create nv_datastore

lds.of_create_from_sql( ls_sql, TRUE )

If lds.RowCount() > 0 Then
	ll_retorno = uf_null(lds.GetItemNumber(1,'RET'), 0)
Else
	ll_retorno = 0
End If

Destroy(lds)

return ll_retorno
end function

public subroutine of_excluir ();long ll_codigo, ll_find

dw_cad_funcionario.SetRedraw( False )

If dw_cad_funcionario.RowCount() > 0 Then
	ll_codigo = uf_null(dw_cad_funcionario.GetItemNumber( 1, 'fun_codigo' ), 0)
	if ll_codigo > 0 Then
		if of_delete_userdb( Lower(Left(dw_cad_funcionario.GetItemString(1, 'fun_funcao', Primary!, true),1)) + &
								dw_cad_funcionario.GetItemString(1, 'fun_cpf', Primary!, true) ) <> 1 Then
			Rollback Using SQLCA;
			Msg("Erro ao Gravar")
			Return
		End If
		dw_cad_funcionario.DeleteRow(1)
		If inv_dados.Update( { dw_cad_funcionario} ) = 1 Then
			Msg("Excluido com Sucesso")
			This.of_limpar( )
		Else
			Msg("Erro ao Gravar")
		End If
	End IF
End If

dw_cad_funcionario.SetRedraw( True )
end subroutine

public subroutine of_editar (long al_codigo);lb_alterando = True
lb_inserindo = False
dw_cad_funcionario.SetRedraw( False )
If dw_cad_funcionario.Retrieve( al_codigo ) <=0 Then
	Msg("Funcionario n$$HEX1$$e300$$ENDHEX$$o encontrado")
	of_limpar()
Else
	dw_cad_funcionario.of_bloq_campo( {"fun_codigo"}, true)
	dw_cad_funcionario.of_bloq_campo( {"senhae", "fun_nome", "fun_funcao", "fun_senha", "fun_cpf"}, false)
	iw_pai.of_set_estado('GEVL')
	im_edit.of_enable(is_estado)
End If
dw_cad_funcionario.SetRedraw( True )
end subroutine

public function long of_delete_userdb (string al_user);long ll_retorno
String ls_sql
nv_DataStore lds

ls_sql = "SELECT DBA.DELETE_USERDB('"+ ( al_user ) +"') AS RET from public.DUMMY" ;

lds = Create nv_datastore

lds.of_create_from_sql( ls_sql, TRUE )

If lds.RowCount() > 0 Then
	ll_retorno = uf_null(lds.GetItemNumber(1,'RET'), 0)
Else
	ll_retorno = 0
End If

Destroy(lds)

return ll_retorno
end function

public function integer of_alter_userdb (string old_user, string new_user, string as_pw);long ll_retorno
String ls_sql
nv_DataStore lds

ls_sql = "SELECT DBA.ALTER_USERDB('" + old_user + "', '" + new_user + "', '" + as_pw + "') AS RET from public.DUMMY" ;

lds = Create nv_datastore

lds.of_create_from_sql( ls_sql, TRUE )

If lds.RowCount() > 0 Then
	ll_retorno = uf_null(lds.GetItemNumber(1,'RET'), 0)
Else
	ll_retorno = 0
End If

Destroy(lds)

return ll_retorno
end function

public function integer of_altergroup_userdb (string as_user, string new_group, string old_group);long ll_retorno
String ls_sql
nv_DataStore lds

ls_sql = "SELECT DBA.ALTERGROUP_USERDB('" + as_user + "', '" + new_group + "', '" + old_group + "') AS RET from public.DUMMY" ;

lds = Create nv_datastore

lds.of_create_from_sql( ls_sql, TRUE )

If lds.RowCount() > 0 Then
	ll_retorno = uf_null(lds.GetItemNumber(1,'RET'), 0)
Else
	ll_retorno = 0
End If

Destroy(lds)

return ll_retorno
end function

event constructor;call super::constructor;//
iw_pai = GetParent().Dynamic GetParent()
end event

on uo_cad_funcionario.create
int iCurrent
call super::create
this.dw_cad_funcionario=create dw_cad_funcionario
iCurrent=UpperBound(this.Control)
this.Control[iCurrent+1]=this.dw_cad_funcionario
end on

on uo_cad_funcionario.destroy
call super::destroy
destroy(this.dw_cad_funcionario)
end on

type dw_cad_funcionario from u_dw within uo_cad_funcionario
integer x = 169
integer y = 52
integer width = 3314
integer height = 860
integer taborder = 10
string dataobject = "d_cad_funcionario"
boolean border = false
boolean livescroll = false
boolean ib_forupdate = true
end type

event itemchanged;call super::itemchanged;If dwo.Name = 'fun_codigo' and lb_alterando = False And lb_inserindo = False Then
	of_editar( Long(data) )
End If
end event

