package com.example.spring.backend_utenti.security;

import java.util.Collection;
import java.util.List;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import com.example.spring.backend_utenti.model.Utente;
import com.fasterxml.jackson.annotation.JsonIgnore;

public class UserDetailsImpl implements UserDetails {



    private Long id;
    private String email;
    @JsonIgnore
    private String password;
    private String nome;
    private String cognome;
    private Collection<? extends GrantedAuthority> authorities;

    public UserDetailsImpl(Long id, String email, String password, String nome, String cognome,Collection<? extends GrantedAuthority> authorities) {
        this.id = id;
        this.email = email;
        this.password = password;
        this.nome = nome;
        this.cognome = cognome;
        this.authorities = authorities;
    }

    public static UserDetailsImpl build(Utente utente) {
        List<GrantedAuthority> authorities = List.of(
                new SimpleGrantedAuthority(utente.getRuolo().name())
        );

        return new UserDetailsImpl(
                utente.getId(),
                utente.getEmail(),
                utente.getPassword(),
                utente.getNome(),
                utente.getCognome(),
                authorities
        );
    }

    public Long getId() { return id; }
    public String getNome() { return nome; }
    public String getCognome() { return cognome; }

    @Override public Collection<? extends GrantedAuthority> getAuthorities() { return authorities; }
    @Override public String getPassword() { return password; }
    @Override public String getUsername() { return email; }
    @Override public boolean isAccountNonExpired() { return true; }
    @Override public boolean isAccountNonLocked() { return true; }
    @Override public boolean isCredentialsNonExpired() { return true; }
    @Override public boolean isEnabled() { return true; }
}