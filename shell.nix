# shell.nix
{
  pkgs ? import <nixpkgs> { },
}:

let
  colour-science = pkgs.python3.pkgs.buildPythonPackage rec {
    pname = "colour-science";
    version = "0.4.6";
    format = "pyproject";

    src = pkgs.fetchPypi {
      pname = "colour_science";
      version = "0.4.6";
      hash = "sha256-vpjCybKlyvDEQ0MfQCWZyp4cx9lEu4BBVoA7zJevTPA=";
      # format = "pyproject";   # error: Unsupported format pyproject
    };

    nativeBuildInputs = with pkgs.python3.pkgs; [
      hatchling
      hatch-vcs
    ];

    propagatedBuildInputs = with pkgs.python3.pkgs; [
      numpy
      scipy
      imageio
      typing-extensions
    ];

    doCheck = false;

    meta = with pkgs.lib; {
      description = "Colour Science for Python";
      homepage = "https://www.colour-science.org/";
      license = licenses.bsd3;
    };
  };

  pythonPackages = ps: with ps; [
    black
    numpy
    colour-science
  ];
in
pkgs.mkShell rec {
  buildInputs = [
    (pkgs.python3.withPackages pythonPackages)
  ];

  nativeBuildInputs = with pkgs; [
    cmake
    pkg-config
  ];

  shellHook = ''
    echo "Welcome to colour-science dev shell!"
  '';
}
